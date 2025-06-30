package org.mobile.tcgworld.enums;

public enum ResultCodeEnum {
    SUCCESS("200", "成功"),

    PARAM_ERROR("400", "参数异常"),
    TOKEN_INVALID_ERROR("401", "无效的token"),
    TOKEN_CHECK_ERROR("401", "token验证失败，请重新登录"),
    PARAM_LOST_ERROR("4001", "参数缺失"),

    SYSTEM_ERROR("500", "系统异常"),
    USER_EXIST_ERROR("5001", "用户名已存在"),
    USER_NOT_LOGIN("5002", "用户未登录"),
    USER_ACCOUNT_ERROR("5003", "账号或密码错误"),
    USER_NOT_EXIST_ERROR("5004", "用户不存在"),
    PARAM_PASSWORD_ERROR("5005", "原密码输入错误"),
    NO_AUTH("5006", "无权限"),
    NO_ITEM("5006", "您未选购商品"),

    NO_CARDS("5007","未找到卡片"),
    ITEM_EXIST("600","商品已存在"),
    ITEM_NOT_FIND("601","未找到合适商品"),
    ITEM_NOT_EXIST("602","商品不见了"),
    CART_EMPTY("700","购物车为空"),
    CART_EXIST("701","购物车中已存在商品"),
    CART_NOT_EXIST("702","购物车中不存在该商品"),
    ORDER_NOT_FIND("800","订单不存在"),
    POST_NOT_FIND("900","帖子不见了"),
    COMMENT_FAIL("1000","创建评论失败"),
    UNDEFINED_ERROR("000","未定义错误");

    public String code;
    public String msg;

    ResultCodeEnum(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
