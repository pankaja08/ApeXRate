package com.apexrate.repository;

import com.apexrate.model.Forecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForecastRepository extends JpaRepository<Forecast, Long> {
    List<Forecast> findByCurrencyPairOrderByTargetDateAsc(String currencyPair);
}
