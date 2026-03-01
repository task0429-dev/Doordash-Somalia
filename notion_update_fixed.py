#!/usr/bin/env python3
import os
os.environ['NOTION_TOKEN'] = 'ntn_G7319571298gTSybZIjwl0iVIXaKwPO0Pxi9hQwPXT7dpE'

from notion_client import Client
import json
from datetime import datetime

notion = Client(auth=os.environ['NOTION_TOKEN'])

PAGE_ID = '3141b447cb628014af39de00bd402701'

now = datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')

blocks = [
    {
        "object": "block",
        "type": "heading_1",
        "heading_1": {
            "rich_text": [
                {
                    "type": "text",
                    "text": {
                        "content": "📈 Prime: DoorDash Somalia Pricing Lead - Progress Log"
                    }
                }
            ]
        }
    },
    {
        "object": "block",
        "type": "callout",
        "callout": {
            "rich_text": [
                {
                    "type": "text",
                    "text": {
                        "content": f"Status: 🟢 Active | Repo: task0429-dev/Doordash-Somalia | Branch: main | Updated: {now}"
                    }
                }
            ],
            "icon": {
                "type": "emoji",
                "emoji": "📊"
            }
        }
    },
    # Add more blocks as before...
    {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
            "rich_text": [
                {
                    "type": "text",
                    "text": {
                        "content": "Notion API token invalid (401). Regenerated? Repo mirror in docs/PRIME-PROGRESS.md."
                    }
                }
            ]
        }
    }
]

# Delete all children
notion.blocks.children.delete(block_id=PAGE_ID)

# Append new
result = notion.blocks.children.append(
    block_id=PAGE_ID,
    children=blocks
)

print(json.dumps(result, indent=2))
