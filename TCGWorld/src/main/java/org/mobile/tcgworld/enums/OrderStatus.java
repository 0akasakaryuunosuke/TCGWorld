package org.mobile.tcgworld.enums;

public enum OrderStatus {
    PENDING("待付款"),
    PAID("已付款"),
    SHIPPED("已发货"),
    COMPLETED("已完成"),
    CANCELLED("已取消");

    private final String description;

    OrderStatus(String description) {
        this.description = description;
    }
    public String getDescription() {
        return description;
    }
}
