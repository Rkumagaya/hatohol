/*
 * Copyright (C) 2013 Project Hatohol
 *
 * This file is part of Hatohol.
 *
 * Hatohol is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License, version 3
 * as published by the Free Software Foundation.
 *
 * Hatohol is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with Hatohol. If not, see
 * <http://www.gnu.org/licenses/>.
 */

#include <cppcutter.h>
#include "ItemGroupPtr.h"
#include "ItemDataPtr.h"
#include "ItemGroupStream.h"
using namespace std;

namespace testDBClientUtils {

template <class NativeType, class ItemDataType>
static ItemGroupPtr makeItemGroup(const NativeType *DATA, const size_t NUM_DATA,
                                  const bool *NULL_VECT = NULL)
{
	VariableItemGroupPtr itemGrp;
	for (size_t i = 0; i < NUM_DATA; i++) {
		VariableItemDataPtr item = new ItemDataType(DATA[i]);
		if (NULL_VECT && NULL_VECT[i])
			item->setNull();
		itemGrp->add(item);
	}
	return (ItemGroup *)itemGrp;
}

void setup(void)
{
}

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------
void test_getUint64FromGrp(void)
{
	static const uint64_t DATA[] = {
	  0xfedcba9876543210, 0x8000000000000000, 0x7fffffffffffffff, 0x5};
	static const size_t NUM_DATA = ARRAY_SIZE(DATA);
	ItemGroupPtr itemGrp
	 = makeItemGroup<uint64_t, ItemUint64>(DATA, NUM_DATA);

	// check
	ItemGroupStream itemGroupStream(itemGrp);
	for (size_t i = 0; i < NUM_DATA; i++)
		cppcut_assert_equal(DATA[i], itemGroupStream.read<uint64_t>());
}

void test_getUint64FromGrpWithNull(void)
{
	static const uint64_t DATA[] = {1, 2, 5};
	static const size_t NUM_DATA = ARRAY_SIZE(DATA);
	static const bool NULL_VECT[NUM_DATA] = {true, false, true};
	ItemGroupPtr itemGrp
	 = makeItemGroup<uint64_t, ItemUint64>(DATA, NUM_DATA, NULL_VECT);

	// check
	ItemGroupStream itemGroupStream(itemGrp);
	for (size_t i = 0; i < NUM_DATA; i++) {
		bool isNull = itemGroupStream.getItem()->isNull();
		cppcut_assert_equal(NULL_VECT[i], isNull);
		cppcut_assert_equal(DATA[i], itemGroupStream.read<uint64_t>());
	}
}

void test_getIntFromGrp(void)
{
	static const int DATA[] = {-2984322, 3285, 0};
	static const size_t NUM_DATA = ARRAY_SIZE(DATA);
	ItemGroupPtr itemGrp = makeItemGroup<int, ItemInt>(DATA, NUM_DATA);
	// check
	ItemGroupStream itemGroupStream(itemGrp);
	for (size_t i = 0; i < NUM_DATA; i++)
		cppcut_assert_equal(DATA[i], itemGroupStream.read<int>());
}

void test_getIntFromGrpWithNull(void)
{
	static const int DATA[] = {-2984322, 3285, 0};
	static const size_t NUM_DATA = ARRAY_SIZE(DATA);
	static const bool NULL_VECT[NUM_DATA] = {true, false, true};
	ItemGroupPtr itemGrp =
	   makeItemGroup<int, ItemInt>(DATA, NUM_DATA, NULL_VECT);
	// check
	ItemGroupStream itemGroupStream(itemGrp);
	for (size_t i = 0; i < NUM_DATA; i++) {
		bool isNull = itemGroupStream.getItem()->isNull();
		cppcut_assert_equal(NULL_VECT[i], isNull);
		cppcut_assert_equal(DATA[i], itemGroupStream.read<int>());
	}
}

void test_getStringFromGrp(void)
{
	static const string DATA[] = {"ABCE", "", " - ! - #\"'\\"};
	static const size_t NUM_DATA = ARRAY_SIZE(DATA);
	ItemGroupPtr itemGrp =
	   makeItemGroup<string, ItemString>(DATA, NUM_DATA);

	// check
	ItemGroupStream itemGroupStream(itemGrp);
	for (size_t i = 0; i < NUM_DATA; i++)
		cppcut_assert_equal(DATA[i], itemGroupStream.read<string>());
}

void test_getStringFromGrpWithNull(void)
{
	static const string DATA[] = {"ABCE", "", " - ! - #\"'\\"};
	static const size_t NUM_DATA = ARRAY_SIZE(DATA);
	static const bool NULL_VECT[NUM_DATA] = {true, false, true};
	ItemGroupPtr itemGrp =
	   makeItemGroup<string, ItemString>(DATA, NUM_DATA, NULL_VECT);

	// check
	ItemGroupStream itemGroupStream(itemGrp);
	for (size_t i = 0; i < NUM_DATA; i++) {
		bool isNull = itemGroupStream.getItem()->isNull();
		cppcut_assert_equal(NULL_VECT[i], isNull);
		cppcut_assert_equal(DATA[i], itemGroupStream.read<string>());
	}
}

} // namespace testActionManager
