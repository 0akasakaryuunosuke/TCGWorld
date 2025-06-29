package org.mobile.tcgworld.Controller;

import org.mobile.tcgworld.Result;
import org.mobile.tcgworld.Service.CardService;
import org.mobile.tcgworld.Service.ItemService;
import org.mobile.tcgworld.Service.UserService;
import org.mobile.tcgworld.dto.ItemDTO;
import org.mobile.tcgworld.entity.Card;
import org.mobile.tcgworld.entity.User;
import org.mobile.tcgworld.enums.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.mobile.tcgworld.entity.Item;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tcgworld/items")
public class ItemController {

    @Autowired
    ItemService itemService;
    @Autowired
    UserService userService;
    @Autowired
    CardService cardService;

    @GetMapping("/getAllItems")
    public Result getAllItems(){
        List<Item> itemList  = itemService.getAllItem();
        if(!itemList.isEmpty()){
            List<ItemDTO> res= itemService.fillItemDTO(itemList);
            return Result.success(res);
        }
        return Result.error(ResultCodeEnum.ITEM_NOT_FIND);
    }

    @GetMapping("/getItemsByCardCode/{cardCode}")
    public Result getItemsByCardCode(@PathVariable String cardCode,
                                     @RequestParam(defaultValue = "0") int pageNumber,
                                     @RequestParam(defaultValue = "10") int pageSize){
        Page<Item> itemList  = itemService.getItemsByCardCode(cardCode,pageNumber,pageSize);
        if(!itemList.isEmpty()){

            return Result.success(itemService.fillItemDTO(itemList.getContent()));
        }
        return Result.error(ResultCodeEnum.ITEM_NOT_FIND);
    }
    @GetMapping("/getItemsByUserID/{userID}")
    public Result getItemsByUserID(@PathVariable String userID){
        Long id= Long.valueOf(userID);
        List<Item> itemList  = itemService.getItemByUserID(id);

        if(!itemList.isEmpty()){
            return Result.success(itemService.fillItemDTO(itemList));
        }
        return Result.error(ResultCodeEnum.ITEM_NOT_FIND);
    }
    @GetMapping("/getItemByID/{id}")
    public Result getItemByID(@PathVariable String id){
        Optional<Item> item = itemService.getItem(Long.valueOf(id));

        ItemDTO dto=new ItemDTO();
        if(item.isEmpty())
            return Result.error(ResultCodeEnum.ITEM_NOT_EXIST);
        Optional<User> user=userService.getUserById(item.get().getUserID());
        Optional<Card> card=cardService.getCardByCode(item.get().getCardCode());
        if(card.isPresent()&&user.isPresent()){
            dto.setItem(item.get());
            String userName = user.get().getUsername();
            dto.setCardName(card.get().getCardName());
            dto.setImageUrl(card.get().getImage_url());
            dto.setUserName(userName);
            return Result.success(dto);
        }
       else return Result.error(ResultCodeEnum.ITEM_NOT_EXIST);
    }

    @PostMapping("/saveItem")
    public Result saveItem(@RequestBody Item item){
        Optional<Item> result = itemService.getItem(item.getId());
        if(result.isEmpty()){
            return Result.error(ResultCodeEnum.ITEM_NOT_EXIST);
        }
        result.get().setPrice(item.getPrice());
        result.get().setNumber(item.getNumber());
        result.get().setStatus(item.getStatus());
        itemService.updateItem(result.get());
        return Result.success();
    }
    @PostMapping("/registerItem")
    public Result registerItem(@RequestBody Item item){
        String cardCode=item.getCardCode();
        Long userID=item.getUserID();
        if(!itemService.isExist(cardCode,userID)){
            item.setStatus("on");
            itemService.insertItem(item);
            return Result.success();
        }
        else return Result.error(ResultCodeEnum.ITEM_EXIST);
    }




}
