package org.mobile.tcgworld.Service;

import org.mobile.tcgworld.entity.Card;
import org.mobile.tcgworld.enums.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface CardService {
     List<Card> searchCards(
             String cardName,
             String race,
             String attribute,
             String cardType
     );
     List<Card>findCardsByCardName(String cardName);
     Page<Card> getAll(int pageNumber, int pageSize);

     Optional<Card> getCardByCode(String code);
}
