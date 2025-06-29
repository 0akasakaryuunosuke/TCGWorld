package org.mobile.tcgworld.Service.Impl;

import org.mobile.tcgworld.Service.AddressService;
import org.mobile.tcgworld.dao.AddressRepository;
import org.mobile.tcgworld.entity.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressServiceImpl implements AddressService {
    @Autowired
    private AddressRepository addressRepository;
    @Override
    public void createAddress(Address address) {

        if(address.isDefault()){
            System.out.println("true路径in：");
            addressRepository.clearDefault(address.getUserID());
            System.out.println("true路径out：");
        }
        addressRepository.save(address);
    }

    @Override
    public void updateAddress(Address address) {
        Long id = address.getId();
        if(addressRepository.findById(id).isEmpty()) {
            throw new RuntimeException("地址不存在");
        }
        else{
            addressRepository.save(address);
        }
    }

    @Override
    public void deleteAddress(Long id) {
        if(addressRepository.findById(id).isEmpty()) {
            throw new RuntimeException("地址不存在");
        }
        else{
            addressRepository.deleteById(id);
        }
    }

    @Override
    public List<Address> getAllAddress(Long userID) {
        return addressRepository.findAddressesByUserID(userID);
    }
    @Override
    public void setDefaultAddress(Long userID,Long id){
        if(addressRepository.findById(id).isEmpty()) {
            throw new RuntimeException("未找到地址");
        }
        else{
            addressRepository.clearDefaultExcept(userID, id);
            addressRepository.setAddressDefault(id);
        }
    }
    @Override
    public Optional<Address> getDefaultAddress(Long userID){
       Optional<Address> address= addressRepository.findDefaultByUserID(userID);
       if(address.isEmpty()){
           throw new RuntimeException("未设置默认地址");
       }
       else{
           return address;
       }
    }
    @Override
    public Optional<Address>getAddressByID(Long id){
        return addressRepository.findById(id);
    }
}
