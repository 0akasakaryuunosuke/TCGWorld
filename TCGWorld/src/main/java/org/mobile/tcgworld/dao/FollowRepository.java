package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.Cart;
import org.mobile.tcgworld.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByUserIDAndFollowerID(Long userID,Long followerID);
}
