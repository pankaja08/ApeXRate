package com.apexrate.repository;

import com.apexrate.model.Conversion;
import com.apexrate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversionRepository extends JpaRepository<Conversion, Long> {
    List<Conversion> findByUserOrderByTimestampDesc(User user);
}
