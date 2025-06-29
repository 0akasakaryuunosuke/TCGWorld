package org.mobile.tcgworld.Controller;

import org.mobile.tcgworld.Result;
import org.mobile.tcgworld.Service.AddressService;
import org.mobile.tcgworld.entity.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tcgworld/address")
public class AddressController {
    @Autowired
    private AddressService addressService;

    @PostMapping("/createAddress")
    public Result createAddress(@RequestBody Address address){
        try{
            System.out.println("-------"+address);
            addressService.createAddress(address);
            return Result.success();
        }
        catch (Exception e){
            return Result.error(e.getMessage());
        }
    }
    @PostMapping("/updateAddress")
    public Result updateAddress(@RequestBody  Address address){
        try{
            addressService.updateAddress(address);
            return Result.success();
        }
        catch (Exception e){
            return Result.error(e.getMessage());
        }
    }
    @DeleteMapping("/deleteAddress/{id}")
    public Result deleteAddress(@PathVariable String id){
        try{
            addressService.deleteAddress(Long.valueOf(id));
            return Result.success();
        }
        catch (Exception e){
            return Result.error(e.getMessage());
        }
    }
    @PostMapping("/setAddressDefault")
    public Result setAddressDefault(@RequestParam String userID,@RequestParam String id){
        try{
            addressService.setDefaultAddress(Long.valueOf(userID),Long.valueOf(id));
            return Result.success();
        }
        catch (Exception e){
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/getAddress/{userID}")
    public Result getAddress(@PathVariable String userID){
        if(userID==null)
            return Result.error();
        List<Address> address =addressService.getAllAddress(Long.valueOf(userID));
        return Result.success(address);
    }

    @GetMapping("/getDefault/{userID}")
    public Result getDefault(@PathVariable String userID){
        if(userID==null)
            return Result.error();
        try{
           Optional<Address> address = addressService.getDefaultAddress(Long.valueOf(userID));
            return Result.success(address);
        }
        catch (Exception e){
            return Result.error(e.getMessage());
        }
    }
    @GetMapping("/getAddressByID/{id}")
    public Result getAddressByID(@PathVariable String id){
        Optional<Address>address =addressService.getAddressByID(Long.valueOf(id));
        if(address.isPresent()){
            return Result.success(address);
        }
        return Result.success();
    }
}
