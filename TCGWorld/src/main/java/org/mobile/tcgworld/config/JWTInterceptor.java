package org.mobile.tcgworld.config;

import io.jsonwebtoken.Claims;
import org.mobile.tcgworld.utils.TokenUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class JWTInterceptor implements HandlerInterceptor {

    /**
     * 请求进入 Controller 前执行
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 从请求头中获取 token
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value()); // 401
            response.getWriter().write("未登录或令牌缺失");
            return false;
        }

        token = token.substring(7); // 去掉 "Bearer "

        try {
            // 解析 token
            Claims claims = TokenUtil.parseJWT(token);
            // 设置用户 ID 到 request 属性中，供后续使用
            request.setAttribute("userID", claims.getSubject());
            return true;
        } catch (Exception e) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value()); // 401
            response.getWriter().write("令牌无效或已过期");
            return false;
        }
    }
}
