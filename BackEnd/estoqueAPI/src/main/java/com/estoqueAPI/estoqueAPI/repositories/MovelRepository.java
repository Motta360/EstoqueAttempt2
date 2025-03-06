package com.estoqueAPI.estoqueAPI.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.estoqueAPI.estoqueAPI.models.Movel;

@Repository
public interface MovelRepository extends JpaRepository<Movel,Long> {
    
}
