import requests
import json
from datetime import datetime

NOTION_TOKEN = 'ntn_G7319571298gTSybZIjwl0iVIXaKwPO0Pxi9hQwPXT7dpE'
PAGE_ID = '3141b447cb628014af39de00bd402701'
BASE_URL = 'https://api.notion.com/v1'

headers = {
    'Authorization': f'Bearer {NOTION_TOKEN}',
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28'
}

def create_blocks():
    now = datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')
    return [
        {
            'object': 'block',
            'type': 'heading_1',
            'heading_1': {
                'rich_text': [{'type': 'text', 'text': {'content': '📈 Prime: DoorDash Somalia Pricing Lead'}}]
            }
        },
        {
            'object': 'block',
            'type': 'callout',
            'callout': {
                'rich_text': [{'type': 'text', 'text': {'content': 'Status: 🟢 Active | Repo: task0429-dev/Doordash-Somalia | Branch: main (0cc2a9a) | Updated: ' + now}}],
                'icon': {'type': 'emoji', 'emoji': '✅'}
            }
        },
        {
            'object': 'block',
            'type': 'paragraph',
            'paragraph': {
                'rich_text': [{'type': 'text', 'text': {'content': 'Mission: Somalia-ready pricing foundation. COD-first, fixed delivery MVP, sub free-override. Affordable + margin-protected.'}}]
            }
        },
        {
            'object': 'block',
            'type': 'heading_2',
            'heading_2': {
                'rich_text': [{'type': 'text', 'text': {'content': '🧠 What I Did: Repo Analysis + Clone'}}]
            }
        },
        {
            'object': 'block',
            'type': 'table',
            'table': {
                'table_width': 3,
                'has_column_header': True,
                'number_of_rows': 6,
                'children': [
                    {
                        'object': 'table_row',
                        'type': 'table_row',
                        'table_row': {
                            'cells': [
                                [{'type': 'text', 'text': {'content': 'Component'}}, {'type': 'text', 'text': {'content': 'Status'}}, {'type': 'text', 'text': {'content': 'Notes'}}],
                                [{'type': 'text', 'text': {'content': 'config.py'}}, {'type': 'text', 'text': {'content': '⚠️ Minimal'}}, {'type': 'text', 'text': {'content': 'DB/Redis only. No pricing defaults → FIXED.'}}],
                                [{'type': 'text', 'text': {'content': 'fee_calculator.py'}}, {'type': 'text', 'text': {'content': '✅ Core Logic Live'}}, {'type': 'text', 'text': {'content': 'base + per_km + surge + COD + sub (free/fixed/active).'}}],
                                [{'type': 'text', 'text': {'content': 'schemas/order.py'}}, {'type': 'text', 'text': {'content': '✅ Ready'}}, {'type': 'text', 'text': {'content': 'OrderOut has all fees.'}}],
                                [{'type': 'text', 'text': {'content': 'models/order.py'}}, {'type': 'text', 'text': {'content': '✅ Persists'}}, {'type': 'text', 'text': {'content': 'All fee fields on Order.'}}],
                                [{'type': 'text', 'text': {'content': 'tests/test_fees_subscription.py'}}, {'type': 'text', 'text': {'content': '✅ Tests Pass'}}, {'type': 'text', 'text': {'content': 'No-sub, surge, free/fixed/expired sub + order integration.'}}]
                            ]
                        }
                    }
                ]
            }
        },
        {
            'object': 'block',
            'type': 'paragraph',
            'paragraph': {
                'rich_text': [{'type': 'text', 'text': {'content': 'Key: Pricing already 80% MVP (distance default, sub override). COD fixed. SOS ints.'}}]
            }
        },
        {
            'object': 'block',
            'type': 'heading_2',
            'heading_2': {
                'rich_text': [{'type': 'text', 'text': {'content': '🔄 What I\'m Doing Right Now'}}]
            }
        },
        {
            'object': 'block',
            'type': 'numbered_list',
            'numbered_list': {
                'rich_text': [
                    {'type': 'text', 'text': {'content': 'Patching config.py: Add fixed-mode toggle + Somalia defaults.'}},
                    {'type': 'text', 'text': {'content': 'Enhance calculator: if fixed_mode: delivery = FIXED_FEE.'}},
                    {'type': 'text', 'text': {'content': 'Prep KPI Doc: docs/ECONOMICS.md.'}}
                ]
            }
        },
        {
            'object': 'block',
            'type': 'heading_2',
            'heading_2': {
                'rich_text': [{'type': 'text', 'text': {'content': '📋 Full Plan (Priority A-D)'}}]
            }
        },
        {
            'object': 'block',
            'type': 'toggle',
            'toggle': {
                'rich_text': [{'type': 'text', 'text': {'content': 'A) Config + Defaults ⏳ (Editing Now)'}}],
                'children': [
                    {
                        'object': 'block',
                        'type': 'code',
                        'code': {
                            'rich_text': [{'type': 'text', 'text': {'content': '# backend/app/core/config.py → ADD:\nPRICING_MODE = os.getenv("PRICING_MODE", "fixed")  # fixed|distance\nPRICING_FIXED_FEE_SOS = int(os.getenv("PRICING_FIXED_FEE_SOS", "15000"))  # $25 USD equiv\nPRICING_BASE_SOS = int(os.getenv("PRICING_BASE_SOS", "10000"))\nPRICING_PER_KM_SOS = int(os.getenv("PRICING_PER_KM_SOS", "2000"))\nPRICING_COD_SOS = int(os.getenv("PRICING_COD_SOS", "1000"))\nPRICING_SURGE_MULTIPLIER = float(os.getenv("PRICING_SURGE_MULTIPLIER", "1.0"))'}}],
                            'language': 'python'
                        }
                    }
                ]
            }
        },
        {
            'object': 'block',
            'type': 'toggle',
            'toggle': {
                'rich_text': [{'type': 'text', 'text': {'content': 'B) Sub Integration ✅ Mostly Done'}}],
                'children': [
                    {
                        'object': 'block',
                        'type': 'paragraph',
                        'paragraph': {
                            'rich_text': [{'type': 'text', 'text': {'content': 'Active sub → delivery=0 or fixed. COD always.'}}]
                        }
                    }
                ]
            }
        },
        {
            'object': 'block',
            'type': 'toggle',
            'toggle': {
                'rich_text': [{'type': 'text', 'text': {'content': 'C) Fee Breakdown ✅ Live'}}],
                'children': [
                    {
                        'object': 'block',
                        'type': 'paragraph',
                        'paragraph': {
                            'rich_text': [{'type': 'text', 'text': {'content': 'All responses show delivery_fee_sos, surge_fee_sos, etc.'}}]
                        }
                    }
                ]
            }
        },
        {
            'object': 'block',
            'type': 'toggle',
            'toggle': {
                'rich_text': [{'type': 'text', 'text': {'content': 'D) KPI + Docs ⏳ Next'}}],
                'children': [
                    {
                        'object': 'block',
                        'type': 'code',
                        'code': {
                            'rich_text': [{'type': 'text', 'text': {'content': '# Somalia Economics MVP\\n\\n## Assumptions (SOS:USD ~600:1 | Confidence: High)\\n- Avg Subtotal: 40,000 SOS ($67)\\n- Fixed Deliv: 15,000 SOS (38% coverage)\\n- COD Fee: 1,000 SOS (2.5%)\\n- Sub Adoption: 10% (free deliv → LTV offset)\\n- COD Risk: 5% non-collect\\n- Cancels: <10%\\n\\n## KPIs (Targets)\\n| Metric | Target | Formula |\\n|--------|--------|---------|\\n| Contrib Margin/Order | >35% | (subtotal + COD - courier_payout) / total |\\n| Deliv Coverage | >40% | deliv_fee / subtotal |\\n| COD Adjust | -5% | non_collect / COD_orders |\\n| Non-Pay Impact | <3% | refunds / completed |'}}],
                            'language': 'markdown'
                        }
                    }
                ]
            }
        },
        {
            'object': 'block',
            'type': 'heading_2',
            'heading_2': {
                'rich_text': [{'type': 'text', 'text': {'content': '🚧 Blockers & Next 3 Actions'}}]
            }
        },
        {
            'object': 'block',
            'type': 'table',
            'table': {
                'table_width': 2,
                'has_column_header': True,
                'number_of_rows': 3,
                'children': [
                    {
                        'object': 'table_row',
                        'type': 'table_row',
                        'table_row': {
                            'cells': [
                                [{'type': 'text', 'text': {'content': 'Blocker'}}, {'type': 'text', 'text': {'content': 'Resolution'}}],
                                [{'type': 'text', 'text': {'content': 'GH Auth'}}, {'type': 'text', 'text': {'content': 'Need PAT or `gh auth login`.'}}],
                                [{'type': 'text', 'text': {'content': 'Push/PR'}}, {'type': 'text', 'text': {'content': 'Local branch `feat/pricing-config` → test → PR.'}}]
                            ]
                        }
                    }
                ]
            }
        },
        {
            'object': 'block',
            'type': 'numbered_list',
            'numbered_list': {
                'rich_text': [
                    {'type': 'text', 'text': {'content': 'Commit Config + Calculator Patch (15m).'}} ,
                    {'type': 'text', 'text': {'content': 'Add ECONOMICS.md + Tests (10m).'}} ,
                    {'type': 'text', 'text': {'content': 'Docker Test + PR (20m). ETA Push: 45m.'}} 
                ]
            }
        },
        {
            'object': 'block',
            'type': 'paragraph',
            'paragraph': {
                'rich_text': [{'type': 'text', 'text': {'content': 'Risks: Fuel volatility (surge buffer), low density (fixed fee protects).'}}]
            }
        }
    ]

# Clear existing children and append new
response = requests.patch(
    f'{BASE_URL}/blocks/{PAGE_ID}/children',
    headers=headers,
    json={'children': create_blocks()}
)

print(json.dumps(response.json(), indent=2))
print(f'Status: {response.status_code}')
