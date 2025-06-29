package org.mobile.tcgworld.utils;
import org.mobile.tcgworld.entity.Card;
import org.mobile.tcgworld.enums.*;
import org.springframework.data.jpa.domain.Specification;

public class CardSpecification {

    public static Specification<Card> filterCards(
            String cardName,
            String race,
            String attribute,
            String cardType
    ) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (cardName != null && !cardName.isEmpty()) {
                predicates = cb.and(predicates, cb.like(root.get("cardName"), "%" + cardName + "%"));
            }
            if (race != null&& !race.isEmpty()) {
                predicates = cb.and(predicates, cb.equal(root.get("race"), race));
            }
            if (attribute != null&& !attribute.isEmpty()) {
                predicates = cb.and(predicates, cb.equal(root.get("attribute"), attribute));
            }
            if (cardType != null&& !cardType.isEmpty()) {
                predicates = cb.and(predicates, cb.equal(root.get("cardType"), cardType));
            }

            return predicates;
        };
    }
}
