# App Store Connect roles

🇬🇧 English · 🇹🇷 [Türkçe](ROLES_tr.md)

This page shows what each App Store Connect role can do and what's at risk if the AI makes a mistake. My advice: always give the key the narrowest role that does the job.

| Role | What it can do | Risk |
|:--|:--|:--|
| **Admin** | Everything, including user management (`users`), code signing (`provisioning`) and webhooks (`webhooks`). | **Highest.** It can revoke other people's access and delete certificates and profiles, which breaks signing for the whole team. The damage reaches beyond your own app. |
| **App Manager** | Runs the app end to end: metadata (`apps`), versions (`versions`), builds (`builds`), TestFlight (`testflight`), subscriptions and in-app purchases (`subscriptions`, `iap`), pricing (`pricing`). | **High.** It can submit or pull a live version and delete an in-app purchase or a subscription group. It directly affects your live listing and your revenue. |
| **Developer** | Builds and testing only: builds (`builds`), TestFlight (`testflight`), Xcode Cloud (`xcode_cloud`). It can upload, not submit. | **Medium.** It can delete testers, builds and beta groups, but it can't touch pricing or live metadata, or submit for review. |
| **Marketing** | Runs your store presence: screenshots, custom product pages, in-app events and reviews (`marketing`). | **Medium.** It can remove product pages, previews and in-app events that customers already see. |
| **Sales** | Reads sales and trend reports (`analytics`). | **Low.** Almost entirely read-only; report requests don't change your listing. |
| **Finance** | Reads finance and payment reports (`analytics`; you also need to enter your Vendor number in setup). | **Low.** Same as Sales: the mostly read-only `analytics` area. |
| **Customer Support** | Reads and replies to customer reviews (`reviews`, including `reviews_ai__*`). | **Low to medium.** A reply is public. You can take it back, but customers may see a mistake before you notice it. |

> [!NOTE]
> Most day-to-day release work only needs **App Manager**.
> For uploading builds from CI, **Developer** is enough.
> Add **Finance** or **Sales** only if you really use the `analytics` tools.

## Least privilege in practice

The table above shows the roles you *choose* when you [create the key](SETUP_en.md#create-an-api-key). A few limits apply on top of that:

- **The first request for an analytics report type needs Admin, but only once.** If a report type has never been requested on your account, starting it takes an Admin key. Once it exists, a key with the **Sales** or **Finance** role can read it. So use an Admin key for that first request only, and do the daily work with a narrower one.
- **No role reaches the Account Holder area.** Agreements, tax forms and banking details are managed only on their own web page. Until an unsigned or expired agreement is accepted, the account is blocked.
- **To see what a key can actually access,** ask the AI: *"Check my key's permissions."* Heimdall tries five areas one by one (**reports**, **store information**, **customer reviews**, **user management** and **certificates**) and reports each as one of the following:

| Status | What it means |
|:--|:--|
| `ok` | This area is open; your key works here. |
| `forbidden` | The key works, but its role doesn't cover this area. Pick a role from the table above. |
| `unauthorized` | The key itself is invalid or revoked. Changing the role won't help; run `setup` with a new key. |
| `agreement` | Your account has an unsigned or expired agreement. Only the Account Holder can fix it, by signing in at [developer.apple.com/account](https://developer.apple.com/account) and accepting the current Program License Agreement. No key can fix this. |
| `unknown` | The check couldn't run: a connection problem, an error on Apple's side, or no app on the account yet. **Don't read this as a refusal**; it doesn't mean anything is wrong with your key. Try again a little later. |
