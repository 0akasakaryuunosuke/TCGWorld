package org.mobile.tcgworld.Controller;

import org.mobile.tcgworld.Result;
import org.mobile.tcgworld.Service.CardService;
import org.mobile.tcgworld.Service.CartService;
import org.mobile.tcgworld.Service.ItemService;
import org.mobile.tcgworld.dto.CartDTO;
import org.mobile.tcgworld.dto.ItemDTO;
import org.mobile.tcgworld.entity.Card;
import org.mobile.tcgworld.entity.Cart;
import org.mobile.tcgworld.entity.Item;
import org.mobile.tcgworld.entity.User;
import org.mobile.tcgworld.enums.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tcgworld/carts")
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private ItemService itemService;
    @Autowired
    private CardService cardService;

    @GetMapping("/getCart/{userId}")
    public Result getCart(@PathVariable String userId){
        List<CartDTO> result =cartService.findOwnerAllCarts(Long.valueOf(userId));
        return Result.success(result);
    }
    @PostMapping("/addToCart")
    public Result addToCart(@RequestBody Cart cart){
        Long userID = cart.getOwnerID();
        Long itemID = cart.getItemId();
        if(!cartService.isExist(userID,itemID)) {
            cartService.addCart(cart);
            System.out.println("-----add"+cart);
            return Result.success();
        }
        return  Result.error(ResultCodeEnum.CART_EXIST);
    }
    @PostMapping("/updateCart")
    public Result updateCart(@RequestBody CartDTO cart){
        Long ownerID = cart.getOwnerID();
        List<ItemDTO> items = cart.getItems();
        for (ItemDTO dto: items
             ) {
            Long itemID= dto.getId();
            Optional<Cart> old = cartService.findCartByOwnerIDAndItemID(ownerID,itemID);
            if(old.isPresent()){
                int delta=dto.getNumber()-old.get().getNumber();
                Optional<Item> item =itemService.getItem(dto.getId());
                if(item.isPresent()){
                    BigDecimal price=item.get().getPrice();
                    double temp = delta*Double.parseDouble(String.valueOf(price));
                    BigDecimal newTotalPrice=BigDecimal.valueOf(temp);
                    old.get().setTotalPrice(newTotalPrice);
                    old.get().setNumber(dto.getNumber());
                    cartService.updateCart(old.get());
                }
            }
        }
        return Result.success();
    }
    @DeleteMapping("/deleteCart/{ownerID}/{itemID}")
    public Result deleteCart(@PathVariable String itemID, @PathVariable String ownerID){
        try {
            Optional<Cart> cart =cartService.findCartByOwnerIDAndItemID(Long.valueOf(ownerID),Long.valueOf(itemID));
            if(cart.isEmpty())
                return Result.error(ResultCodeEnum.CART_NOT_EXIST);
            cartService.deleteCart(cart.get().getId());
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error("删除失败: " + e.getMessage());
        }
    }
    @GetMapping("/getCartsByUserIDAndStoreID/{userID}/{storeID}")
    public Result getCartsByUserIDAndStoreID(@PathVariable String userID,@PathVariable String storeID){
        CartDTO dto=cartService.findCartByUserIDAndStoreID(Long.valueOf(userID),Long.valueOf(storeID));
        return Result.success(dto);
    }
    @DeleteMapping("/deleteCartsByUserIDAndStoreID/{userID}/{storeID}")
    public Result deleteCartsByUserIDAndStoreID(@PathVariable String userID,@PathVariable String storeID){
        try{
            System.out.println("---------------");
            cartService.deleteCartByUserIDAndStoreID(Long.valueOf(userID),Long.valueOf(storeID));
            return Result.success("删除成功");
        }
        catch (Exception e){
            return Result.error("删除失败: " + e.getMessage());
        }
    }


}
