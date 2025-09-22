package com.klef.practice;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Integer>{
	Hospital findByEmail(String email);
    Hospital findByContact(String contact);

}
