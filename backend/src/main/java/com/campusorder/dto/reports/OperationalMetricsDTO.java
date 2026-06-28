package com.campusorder.dto.reports;

public class OperationalMetricsDTO {

    private MetricStatsDTO timeToPreparation;
    private MetricStatsDTO preparation;
    private MetricStatsDTO waitingPickup;
    private MetricStatsDTO totalDelivery;
    private Long ordersAnalyzed;

    public OperationalMetricsDTO(
            MetricStatsDTO timeToPreparation,
            MetricStatsDTO preparation,
            MetricStatsDTO waitingPickup,
            MetricStatsDTO totalDelivery,
            Long ordersAnalyzed
    ) {
        this.timeToPreparation = timeToPreparation;
        this.preparation = preparation;
        this.waitingPickup = waitingPickup;
        this.totalDelivery = totalDelivery;
        this.ordersAnalyzed = ordersAnalyzed;
    }

    public MetricStatsDTO getTimeToPreparation() {
        return timeToPreparation;
    }

    public MetricStatsDTO getPreparation() {
        return preparation;
    }

    public MetricStatsDTO getWaitingPickup() {
        return waitingPickup;
    }

    public MetricStatsDTO getTotalDelivery() {
        return totalDelivery;
    }

    public Long getOrdersAnalyzed() {
        return ordersAnalyzed;
    }
}