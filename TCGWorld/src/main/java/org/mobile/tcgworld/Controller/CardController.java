package org.mobile.tcgworld.Controller;

import org.mobile.tcgworld.Result;
import org.mobile.tcgworld.Service.CardService;
import org.mobile.tcgworld.entity.Card;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tcgworld/cards")
public class CardController {
    @Autowired
    private CardService cardService;
    @PostMapping("/search")
    public ResponseEntity<?> searchCards(@RequestBody Card card){
        String cardName = card.getCardName();
        String race = card.getRace();
        String attribute = card.getAttribute();
        String cardType = card.getCardType();

        List<Card> cards = cardService.searchCards(
                cardName,
                race,
                attribute,
                cardType
        );
        if(cards.isEmpty())
            return ResponseEntity.status(401).body(Map.of(
                "status","错误",
                "message","没有找到适合的卡"
        ));
        return ResponseEntity.ok(Map.of(
           "message","查询成功" ,
                "data",cards
        ));
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllCards(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        Page<Card> cardPage = cardService.getAll(pageNumber, pageSize);
        if (cardPage.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "status", "错误",
                    "message", "没有找到卡片"
            ));
        }
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "分页查询成功",
                "data", cardPage.getContent(),
                "totalPages", cardPage.getTotalPages(),
                "totalElements", cardPage.getTotalElements(),
                "currentPage", cardPage.getNumber()
        ));
    }

    @GetMapping("/getByCode/{code}")
    public Result getByCode(@PathVariable String code){
        Optional<Card> card =cardService.getCardByCode(code);
        return card.map(Result::success).orElseGet(() -> Result.error());
    }

}
