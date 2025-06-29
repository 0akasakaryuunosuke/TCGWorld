package org.mobile.tcgworld.Service.Impl;

import org.mobile.tcgworld.Service.CardService;
import org.mobile.tcgworld.dao.CardRepository;
import org.mobile.tcgworld.entity.Card;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.mobile.tcgworld.utils.CardSpecification;
import java.util.List;
import java.util.Optional;

@Service
public class CardServiceImpl implements CardService {
    @Autowired
    private CardRepository cardRepository;

    @Override
    public List<Card> searchCards(String cardName,
                                  String race,
                                  String attribute,
                                  String cardType) {
        return cardRepository.findAll(CardSpecification.filterCards(cardName, race, attribute, cardType));
    }

    @Override
    public List<Card> findCardsByCardName(String cardName) {
        return cardRepository.findCardsByCardNameContaining(cardName);
    }

    @Override
    public Page<Card> getAll(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return cardRepository.findAll(pageable);
    }

    @Override
    public Optional<Card> getCardByCode(String code) {
       return  cardRepository.findCardByCode(code);
    }
}
