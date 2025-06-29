package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface CardRepository  extends JpaRepository<Card, Long>, JpaSpecificationExecutor<Card> {

    List<Card>findCardsByCardNameContaining(String cardName);

    Optional<Card> findCardByCode(String code);
}
