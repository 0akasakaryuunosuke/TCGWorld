package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    // 根据ID更新用户名
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.username = :username WHERE u.id = :id")
    int updateUsernameById(Long id, String username);

    // 根据ID更新邮箱
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.email = :email WHERE u.id = :id")
    int updateEmailById(Long id, String email);

    @Transactional
    @Modifying
    @Query("UPDATE User u set u.avatar_url =:avatar_url where  u.id=:id")
    int updateAvatar_urlById(Long id,String avatar_url);
}