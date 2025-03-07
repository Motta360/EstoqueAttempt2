package com.estoqueAPI.estoqueAPI.controllers;

import java.util.List;

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
import com.estoqueAPI.estoqueAPI.repositories.EstoqueRepository;
import com.estoqueAPI.estoqueAPI.repositories.MovelRepository;
import com.estoqueAPI.estoqueAPI.services.EstoqueService;



@RestController
@CrossOrigin
public class EstoqueController {

    @Autowired
    private EstoqueService estoqueService;

    @Autowired
    private EstoqueRepository estoqueRepository;

    @Autowired
    private MovelRepository movelRepository;

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
        
    
    
}