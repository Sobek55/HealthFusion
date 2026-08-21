USE healthfusion;

ALTER TABLE Users
ADD COLUMN password_hint VARCHAR(255) NULL;

CREATE TABLE Password_Reset_Tokens (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,

    INDEX idx_reset_user (user_id),
    INDEX idx_reset_expiry (expires_at)
);
