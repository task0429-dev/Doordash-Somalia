# DoorDash Somalia MVP - Security Runbook 🛡️

## Deploy Checklist
- [ ] Secrets in .env (no repo commit)
- [ ] Redis for rate-limit/prod
- [ ] Health/ready endpoints /health /ready
- [ ] Logs to Sentry/central
- [ ] Backup DB daily

## Incident Response
1. **High CPU/Traffic:** Scale horizontally, check rate-limit hits
2. **COD Fraud Spike:** Block IPs via nginx, review audit logs
3. **Order Failure:** Rollback deploy, check /health
4. **Secrets Leak:** Rotate all, scan commit history

## Abuse/Fraud SOP (COD)
- Monitor audit logs for high-freq phone/IP
- Blocklist suspicious patterns
- Phone OTP for high-value
- Manual review <5000 SYP? No - min enforced

## Rollback
`git checkout main && docker-compose down && docker-compose up -d`

## Troubleshooting
- Rate-limit bypassed? Check skip paths
- Logs missing? chmod 755 logs/
