package com.apexrate.repository;

import com.apexrate.model.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
    
    @Query("SELECT e FROM ExchangeRate e WHERE e.currencyPair = :currencyPair ORDER BY e.timestamp DESC")
    List<ExchangeRate> findLatestByCurrencyPair(@Param("currencyPair") String currencyPair);
    
    List<ExchangeRate> findTop6ByCurrencyPairOrderByTimestampDesc(String currencyPair);

    Optional<ExchangeRate> findTopByOrderByTimestampDesc();
}
