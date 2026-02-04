# Deployment and Maintenance Runbook

This guide covers deploying the Cyber Security Dictionary site, performing rollbacks, applying hotfixes, and the checks required to verify each step. It is aimed at newcomers and assumes only basic Git and npm knowledge.

## Deployment

1. **Run tests**
   ```bash
   npm test
   ```
2. **Build the site**
   ```bash
   npm run build
   ```
3. **Push to `main`**
   Commit your changes and push to the `main` branch. GitHub Pages will deploy automatically.
4. **Verify the deployment**
   - Wait for the GitHub Pages build to finish.
   - Visit the site to ensure the change is live and looks correct.

## Rollback

If a deployment causes issues, revert to the last known good commit.

1. **Identify the bad commit**
   ```bash
   git log --oneline
   ```
2. **Revert it**
   ```bash
   git revert <bad_commit_sha>
   git push origin main
   ```
3. **Verify the rollback**
   - Run the verification checks listed below.
   - Visit the site to confirm it works as expected.

### Practice a rollback
New contributors can rehearse a rollback locally.
1. Create a practice branch and revert the most recent commit:
   ```bash
   git checkout -b rollback-test
   git revert HEAD
   ```
2. Run the verification checks.
3. When finished, return to `main` and delete the test branch:
   ```bash
   git checkout main
   git branch -D rollback-test
   ```

## Hotfix procedure

1. **Create a hotfix branch**
   ```bash
   git checkout -b hotfix/<description>
   ```
2. **Apply the fix** and run the verification checks.
3. **Merge and deploy**
   ```bash
   git checkout main
   git merge --no-ff hotfix/<description>
   git push origin main
   ```
4. **Verify the deployment**
   - Ensure the site behaves correctly.
   - Remove the hotfix branch:
     ```bash
     git branch -d hotfix/<description>
     ```

## Verification checks

Run these checks after every deployment, rollback, or hotfix:

```bash
npm test    # HTML validation
npm run build
```

Visually inspect the generated site or run a local server (e.g. `npx http-server`) to confirm pages load without errors.
