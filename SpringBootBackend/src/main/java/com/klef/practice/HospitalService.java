package com.klef.practice;

import java.util.List;

public interface HospitalService {
	
	Hospital addHospital(Hospital hospital);
    List<Hospital> getAllHospitals();
    Hospital getHospitalById(int id);
    Hospital updateHospital(Hospital hospital);
    void deleteHospitalById(int id);
}


