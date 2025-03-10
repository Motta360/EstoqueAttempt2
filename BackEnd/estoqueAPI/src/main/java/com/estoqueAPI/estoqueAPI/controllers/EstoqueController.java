package com.estoqueAPI.estoqueAPI.controllers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.estoqueAPI.estoqueAPI.models.Estoque;
import com.estoqueAPI.estoqueAPI.models.Movel;
import com.estoqueAPI.estoqueAPI.models.Pedido;
import com.estoqueAPI.estoqueAPI.repositories.EstoqueRepository;
import com.estoqueAPI.estoqueAPI.repositories.MovelRepository;
import com.estoqueAPI.estoqueAPI.repositories.PedidoRepository;
import com.estoqueAPI.estoqueAPI.services.EstoqueService;




@RestController
@CrossOrigin(origins = "*")
public class EstoqueController {

    @Autowired
    private EstoqueService estoqueService;

    @Autowired
    private EstoqueRepository estoqueRepository;

    @Autowired
    private MovelRepository movelRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @GetMapping("/{id}/moveis")
    public ResponseEntity<List<Movel>> getMoveis(@PathVariable Long id) {
        try {
            Estoque estoque = estoqueService.getEstoque(id);
            return ResponseEntity.ok(estoque.getMoveis());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Estoque não encontrado", e);
        }
    }

    @GetMapping("/{id}/{movel}")
    public ResponseEntity<Movel> getMovel(@PathVariable Long id, @PathVariable String movel) {

        try {
            Estoque estoque = estoqueService.getEstoque(id);
            for (Movel movel_ : estoque.getMoveis()) {
                if (movel_.getName().equalsIgnoreCase(movel)) {
                    return ResponseEntity.ok(movel_);
                }
                
            }
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Móvel específico não encontrado");
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Movel especifico não encontrado", e);
        }

    }

    @DeleteMapping("/{id}/delete/{movel}")
        public ResponseEntity<Movel> deleteMovel(@PathVariable  Long id,@PathVariable String movel ){
            Estoque estoque = estoqueService.getEstoque(id);
            for (Movel movel_ : estoque.getMoveis()) {
                if (movel_.getName().equalsIgnoreCase(movel)) {
                    estoque.getMoveis().remove(movel_);
                    movelRepository.deleteById(movel_.getId());
                    estoqueRepository.save(estoque);
                    return ResponseEntity.ok(movel_);
                }
                
            }
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Móvel específico não encontrado");

        }


    @PostMapping("/{id}/moveis/add")
    public ResponseEntity<Movel> criarMovel(@RequestBody Movel movel, @PathVariable Long id) {
        Movel novoMovel = movelRepository.save(movel); 
        Estoque e1 = estoqueRepository.findById(id).get();
        e1.getMoveis().add(novoMovel);
        estoqueRepository.save(e1);
        return ResponseEntity.ok(novoMovel); 
    }

    @PostMapping("/pedidos")
    public ResponseEntity<Pedido> criarPedido(@RequestBody Pedido pedido) {
        Pedido novoPedido = pedidoRepository.save(pedido);
        return ResponseEntity.ok(novoPedido);
    }

    @GetMapping("/pedidos")
    public ResponseEntity<List<Pedido>> getPedidos() {

        List<Pedido> enviar = pedidoRepository.findAll();
        Collections.reverse(enviar);
        return ResponseEntity.ok(enviar);
    }
    
        
    @GetMapping("/pedidos/{id}")
    public ResponseEntity<Pedido> getPedidoPorId(@PathVariable Long id) {
    return pedidoRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
}
@PostMapping("/pedidos/{id}/executar")
public ResponseEntity<Map<String, String>> executarPedido(@PathVariable Long id, @RequestBody List<Movel> itens) {
    try {
        // Verifica se o pedido existe
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));

        // Atualiza as quantidades dos móveis
        for (Movel item : itens) {
            Optional<Movel> optionalMovel = movelRepository.findByName(item.getName());
            if (optionalMovel.isPresent()) {
                Movel movel = optionalMovel.get();
                System.out.println("Movel encontrado: " + movel); // Log para depuração

                // Verifica se há estoque suficiente
                if(pedido.getEntrada().equalsIgnoreCase("Saida")){
                    if (movel.getQuantidade() >= item.getQuantidade()) {
                        movel.setQuantidade(movel.getQuantidade() - item.getQuantidade());
                        movelRepository.save(movel);
                    } else {
                        // Retorna um objeto JSON com a mensagem de erro
                        Map<String, String> errorResponse = new HashMap<>();
                        errorResponse.put("error", "Estoque insuficiente para o item: " + item.getName());
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
                    }
                }else{
                    movel.setQuantidade(movel.getQuantidade() + item.getQuantidade());
                    movelRepository.save(movel);
                }
            } else {
                // Retorna um objeto JSON com a mensagem de erro
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Item não encontrado: " + item.getName());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
        }

        // Marca o pedido como executado
        pedido.setExecutado(true);
        pedidoRepository.save(pedido);

        // Retorna um objeto JSON com a mensagem de sucesso
        Map<String, String> successResponse = new HashMap<>();
        successResponse.put("message", "Pedido executado com sucesso!");
        return ResponseEntity.ok(successResponse);
    } catch (Exception e) {
        e.printStackTrace(); // Log da exceção

        // Retorna um objeto JSON com a mensagem de erro
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Erro ao executar pedido: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
    
}