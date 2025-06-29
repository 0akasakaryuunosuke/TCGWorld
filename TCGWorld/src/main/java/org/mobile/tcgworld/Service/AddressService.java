package org.mobile.tcgworld.Service;

import org.mobile.tcgworld.entity.Address;

import java.util.List;
import java.util.Optional;

public interface AddressService {
    void createAddress(Address address);
    void updateAddress(Address address);
    void deleteAddress(Long id);
    List<Address> getAllAddress(Long userID);

    void setDefaultAddress(Long userID, Long id);

    Optional<Address> getDefaultAddress(Long userID);

    Optional<Address>getAddressByID(Long id);
}
