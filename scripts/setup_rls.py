import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

direct_url = "postgresql+asyncpg://postgres.tzcqmrdgpxtqzohxgjak:RbcEj*MwLeyv-2a@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

sql_commands = [
    "ALTER TABLE IF EXISTS community_posts ENABLE ROW LEVEL SECURITY;",
    "DROP POLICY IF EXISTS \"Allow anon and auth full access to community_posts\" ON community_posts;",
    "CREATE POLICY \"Allow anon and auth full access to community_posts\" ON community_posts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);",

    "ALTER TABLE IF EXISTS community_comments ENABLE ROW LEVEL SECURITY;",
    "DROP POLICY IF EXISTS \"Allow anon and auth full access to community_comments\" ON community_comments;",
    "CREATE POLICY \"Allow anon and auth full access to community_comments\" ON community_comments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);",

    "ALTER TABLE IF EXISTS community_votes ENABLE ROW LEVEL SECURITY;",
    "DROP POLICY IF EXISTS \"Allow anon and auth full access to community_votes\" ON community_votes;",
    "CREATE POLICY \"Allow anon and auth full access to community_votes\" ON community_votes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);",

    "ALTER TABLE IF EXISTS marketplace_items ENABLE ROW LEVEL SECURITY;",
    "DROP POLICY IF EXISTS \"Allow anon and auth full access to marketplace_items\" ON marketplace_items;",
    "CREATE POLICY \"Allow anon and auth full access to marketplace_items\" ON marketplace_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);",
]

async def main():
    try:
        engine = create_async_engine(direct_url)
        async with engine.begin() as conn:
            for cmd in sql_commands:
                await conn.execute(text(cmd))
        print("✅ SUCCESS: Row Level Security (RLS) policies successfully created on Supabase for community_posts, community_comments, community_votes, and marketplace_items!")
        await engine.dispose()
    except Exception as e:
        print("❌ Error configuring RLS via SQLAlchemy:", e)

if __name__ == "__main__":
    asyncio.run(main())
