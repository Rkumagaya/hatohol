#include "ItemDataPtr.h"

// ---------------------------------------------------------------------------
// Public methods
// ---------------------------------------------------------------------------
ItemDataPtr::ItemDataPtr(ItemId itemId, const ItemGroup *itemGroup)
: ItemPtr(itemGroup->getItem(itemId))
{
}

ItemDataPtr::~ItemDataPtr()
{
}
