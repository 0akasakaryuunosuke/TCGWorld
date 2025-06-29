package org.mobile.tcgworld.Controller;
import org.mobile.tcgworld.Service.UserService;
import org.mobile.tcgworld.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tcgworld/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private  PasswordEncoder passwordEncoder;


    // 获取所有用户
    @GetMapping("getAll")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // 通过 ID 获取用户
    @GetMapping("get/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        try {
            Long userId = Long.valueOf(id);
            return userService.getUserById(userId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (NumberFormatException e) {

            return ResponseEntity.badRequest().build(); // 如果id不是数字，返回400
        }
    }

    // 创建用户
    @PostMapping("signUp")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        String email =user.getEmail();
        if(userService.getUserByEmail(email).isPresent())
            return ResponseEntity.status(401).body(Map.of(
                    "status","注册失败",
                    "message","邮箱已经注册过"
            ));
        String rawPassword = user.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);

       User savedUser = userService.createUser(user);
        return ResponseEntity.ok(Map.of(
            "id",savedUser.getId().toString(),
                "message","注册成功"
                ));
    }

    // 删除用户
    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(Long.valueOf(id));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User userPost) {
        String email = userPost.getEmail();
        String password = userPost.getPassword();

      //  System.out.println("登录请求：" + email + " / " + password);

        Optional<User> optionalUser = userService.getUserByEmail(email);
        if (optionalUser.isEmpty()) {
           // System.out.println("用户不存在");
            return ResponseEntity.status(401).body(Map.of(
                    "status", "fail",
                    "message", "用户名或密码错误"
            ));
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            //System.out.println("密码不匹配，数据库密码为：" + user.getPassword());
            return ResponseEntity.status(401).body(Map.of(
                    "status", "fail",
                    "message", "用户名或密码错误"
            ));
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "登陆成功");
        response.put("username", user.getUsername());
        response.put("id", user.getId().toString());
        return ResponseEntity.ok(response);
    }

}