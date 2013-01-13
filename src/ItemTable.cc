#include <Logger.h>
using namespace mlpl;

#include <stdexcept>
#include "Utils.h"
#include "ItemTable.h"

// ---------------------------------------------------------------------------
// Public methods
// ---------------------------------------------------------------------------
ItemTable::ItemTable(void)
{
}

ItemGroup *ItemTable::addNewGroup(void)
{
	ItemGroup *grp = new ItemGroup();
	add(grp, false);
	return grp;
}

void ItemTable::add(ItemGroup *group, bool doRef)
{
	writeLock();
	if (!m_groupList.empty()) {
		ItemGroup *tail = m_groupList.back();
		if (!tail->isFreezed()) {
			string msg = AMSG("The tail element is not freezed.");
			writeUnlock();
			throw logic_error(msg);
		}
		const ItemGroupType *groupType0 = tail->getItemGroupType();
		const ItemGroupType *groupType1 = group->getItemGroupType();
		if (groupType1 == NULL) {
			group->setItemGroupType(groupType0);
		} else if (*groupType0 != *groupType1) {
			string msg = AMSG("ItemGroupTypes unmatched");
			writeUnlock();
			throw logic_error(msg);
		}
	}

	m_groupList.push_back(group);
	writeUnlock();
	if (doRef)
		group->ref();
}

size_t ItemTable::getNumberOfColumns(void) const
{
	readLock();
	if (m_groupList.empty()) {
		readUnlock();
		return 0;
	}
	size_t ret = (*m_groupList.begin())->getNumberOfItems();
	readUnlock();
	return ret;
}

size_t ItemTable::getNumberOfRows(void) const
{
	readLock();
	size_t ret = m_groupList.size();
	readUnlock();
	return ret;
}

ItemTable *ItemTable::innerJoin(const ItemTable *itemTable) const
{
	MLPL_BUG("Not implemneted: %s\n", __PRETTY_FUNCTION__);
	return NULL;
}

ItemTable *ItemTable::leftOuterJoin(const ItemTable *itemTable) const
{
	MLPL_BUG("Not implemneted: %s\n", __PRETTY_FUNCTION__);
	return NULL;
}

ItemTable *ItemTable::rightOuterJoin(const ItemTable *itemTable) const
{
	MLPL_BUG("Not implemneted: %s\n", __PRETTY_FUNCTION__);
	return NULL;
}

ItemTable *ItemTable::fullOuterJoin(const ItemTable *itemTable) const
{
	MLPL_BUG("Not implemneted: %s\n", __PRETTY_FUNCTION__);
	return NULL;
}

ItemTable *ItemTable::crossJoin(const ItemTable *itemTable) const
{
	MLPL_BUG("Not implemneted: %s\n", __PRETTY_FUNCTION__);
	return NULL;
}

// ---------------------------------------------------------------------------
// Protected methods
// ---------------------------------------------------------------------------
ItemTable::~ItemTable()
{
	// We don't need to take a lock, because this object is no longer used.
	ItemGroupListIterator it = m_groupList.begin();
	for (; it != m_groupList.end(); ++it) {
		ItemGroup *group = *it;
		group->unref();
	}
}
