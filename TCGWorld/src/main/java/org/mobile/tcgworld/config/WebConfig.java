package org.mobile.tcgworld.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private JWTInterceptor jwtInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/**") // 所有路径都拦截
                .excludePathPatterns(
                        "/api/tcgworld/users/login", "/api/tcgworld/users/signUp",
                        "/api/tcgworld/oss/**"
                );
    }
}
