# RevPie advertiser opportunities campaign

Portfolio concept for an announcement to existing RevPie publisher partners.

## Message

**Subject:** New in RevPie: Chime, SoFi, Rocket Money + more

**Preheader:** Add a new revenue layer with this month's featured advertisers.

**Primary action:** Explore Offers. The preview uses the verified RevPie sign-in page at https://revpie.com/login. Replace this with an authenticated offer-directory deep link if available.

**Audience:** Existing publisher partners choosing advertiser offers for their traffic and placements.

**Design:** Violet #7144ff, pale lavender #f4efff, white, near-black #191526, and a restrained aqua accent. The supplied RevPie site screenshot and Brand List.pdf informed the palette. The logo, illustration, and six advertiser marks were extracted from the supplied PDF with transparent margins trimmed. No brand marks were redrawn.

## Why these brands

Selections reflect documented adoption, longevity, or retail footprint and a useful spread of advertiser categories. This is an editorial shortlist, not an independently measured brand-awareness ranking. All six appear in the supplied partner list.

| Brand | Category in the supplied list | Evidence of established presence | Primary source |
| --- | --- | --- | --- |
| Chime | Banking / Deposit Accounts | Reported 10.4 million active members for Q2 2026. | [Chime Q2 2026 results](https://investors.chime.com/news-releases/news-release-details/chime-reports-second-quarter-2026-financial-results) |
| SoFi | Banking / Deposit Accounts | Announced passing 10 million members in 2024. This historical milestone is used only as evidence of an established customer base. | [SoFi member milestone](https://www.sofi.com/newsroom/10-million-members-now-getting-money-right-sofi/) |
| Rocket Money | Budgeting / Investing | Its about page reports more than 10 million app users and describes budgeting and subscription-management services. | [Rocket Money about](https://www.rocketmoney.com/about) |
| Acorns | Budgeting / Investing | Reports more than 16 million all-time customers as of August 26, 2026. All-time customers are different from active customers. | [Acorns product overview](https://www.acorns.com/learn/acorns/what-is-acorns/) |
| LendingTree | Personal Loans | Describes its origins in 1996 and its financial comparison marketplace. | [LendingTree company overview](https://www.lendingtree.com/careers/about/) |
| Lowe's | Home Services | Its corporate locations page reports more than 1,700 U.S. stores. | [Lowe's locations](https://corporate.lowes.com/who-we-are/our-locations) |

Research accessed October 8, 2026. Scale figures stay in these notes rather than the email. Audience-fit descriptions are editorial suggestions based on the listed categories and brand services, not approved targeting rules.

## Portfolio payout examples

Updated October 12, 2026. The user requested complete example terms for each card. These amounts and event definitions are illustrative, not researched market rates or confirmed advertiser payouts. CPA means cost per acquisition, CPC means cost per click, and CPQL means cost per qualified lead.

| Brand | Model | Publisher payout | Conversion event | Basis |
| --- | --- | --- | --- | --- |
| Chime | CPA | $75.00 | First qualifying direct deposit | Illustrative amount and event definition. |
| SoFi | CPA | $150.00 | First qualifying direct deposit | Illustrative amount and event definition. |
| Rocket Money | CPA | $20.00 | Premium account sign-up | User requested CPA and Premium account sign-up; amount is an example. |
| Acorns | CPA | $35.00 | Funded account | Illustrative amount and event definition. |
| LendingTree | CPC | $1.10 | Valid advertiser click | User supplied $1.10 CPC; event wording is an example. |
| Lowe's | CPQL | $45.00 | Qualified home services lead | User requested CPQL; amount and event definition are examples. |

Define qualifying direct-deposit thresholds and timing, a qualified home-services lead, valid clicks, funding requirements, and duplicate/reversal rules using the approved campaign terms. This draft does not assert any of those conditions.

## Complete before a production send

- Confirm that each featured advertiser is newly available to the intended publisher segment. The PDF establishes inclusion in a partner list, not launch dates, current campaign access, or advertiser approval.
- Replace or approve the illustrative payout amounts and conversion events below before sending. These were chosen for this portfolio draft at the user's request; they are not verified RevPie or advertiser terms. LendingTree's $1.10 CPC and the requested payout models were supplied by the user.
- Set an approved RevPie sender name, From address, and Reply-To mailbox. None was invented for this draft.
- Replace the root-relative image URLs with absolute HTTPS URLs hosted for the email send.
- Add the sender postal address through the sending platform before a production send. Replace `{{unsubscribe_url}}` and `{{preferences_url}}` with the platform's supported fields. Include any advertiser-specific disclosures required for the final offers. The portfolio footer omits the recipient message and postal-address placeholder at the user's request.
- Use the accompanying plain-text file for the multipart text alternative. Align final payout values and links in both versions.
- Test in actual inboxes, including Gmail, Apple Mail, and Outlook, before sending. Browser previews confirm layout but do not establish identical inbox rendering.

## Implementation

640px table layout, inline presentation styles, system typography, responsive stacking, image alt text, fixed image dimensions, and solid background-color fallbacks beneath gradients. Core copy remains live HTML when remote images are blocked. No JavaScript, external fonts, new packages, or portfolio layout changes.

The HTML uses the same primary action near the top and at the bottom. Brand cards show audience fit, illustrative payout models, and conversion events. Terms use a compact two-row layout with small labels, muted conversion text, and purple dollar amounts. The values retain the alignment of the original placeholder treatment, with no underlines beneath them. The three-step block emphasizes intent matching, integration, and white glove service from selection to launch. Its numbers progress gradually from lavender through periwinkle to a restrained blue tint. CSS text gradients enhance the transition in supporting clients, with legible solid color fallbacks elsewhere. The benefits section uses the compact heading "YOUR TRAFFIC. OUR MONETIZATION ENGINE." The footer presents the preference links and copyright as a compact centered block with consistent spacing. No fabricated performance results, urgency, discounts, or guaranteed earnings are included.

## Header and moving partner strip

Updated October 12, 2026. The masthead pairs the RevPie logo with purple Offers, Contact Us, and Sign in links. Offers jumps to the featured lineup in the browser preview. The other links use the public site's contact and login URLs; no sign-in was performed.

The black partner strip sits immediately below the closing Explore more offers section and above the footer. Its eight original marks come from the public homepage's repeating background asset, [partners-icons.png](https://www.revpie.com/landing/partners-icons.png), observed on [RevPie](https://www.revpie.com/) on October 12, 2026. Logo order is preserved: Besitos, Current, QuinStreet, EarnIn, Albert, Self, Chime, JG Wentworth. This broader homepage strip is separate from the six featured campaign cards.

The transparent source artwork was composited on black and scaled to a 1280×64 repeat. The 640×88 animated GIF pans left by 4px every 100ms, loops seamlessly every 32 seconds, and stays below 1MB. The opening frame starts at the Albert group, so clients displaying only the first GIF frame still show a complete logo row. The companion PNG is selected by browsers that honor the reduced-motion preference. No JavaScript or CSS animation support is required for the GIF. Classic Outlook versions may show only its first frame; test the final hosted version in the intended inboxes.
