package com.edrisperfume.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bank_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName;

    @Column(name = "account_number", nullable = false, length = 50)
    private String accountNumber;

    @Column(name = "account_holder_name", nullable = false, length = 150)
    private String accountHolderName;

    @Column(length = 100)
    private String branch;

    @Column(name = "qr_code_url", length = 500)
    private String qrCodeUrl;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
