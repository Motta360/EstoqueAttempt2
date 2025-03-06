package com.estoqueAPI.estoqueAPI.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import com.estoqueAPI.estoqueAPI.models.Estoque;
import com.estoqueAPI.estoqueAPI.models.Movel;
import com.estoqueAPI.estoqueAPI.repositories.EstoqueRepository;
import com.estoqueAPI.estoqueAPI.repositories.MovelRepository;

@Configuration
public class DataSeed implements CommandLineRunner {

    @Autowired
    private EstoqueRepository estoqueRepository;

    @Autowired
    private MovelRepository movelRepository;

    @Override
    public void run(String... args) throws Exception {
    }
}