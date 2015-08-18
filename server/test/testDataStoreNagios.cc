/*
 * Copyright (C) 2014 Project Hatohol
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
#include "DataStoreNagios.h"
#include "Hatohol.h"
#include "ArmNagiosNDOUtils.h"
#include "DBTablesTest.h"

using namespace mlpl;

namespace testDataStoreNagios {

void cut_setup(void)
{
	hatoholInit();
	setupTestDB();
}

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------
void test_getMonitoringServerInfo(void)
{
	MonitoringServerInfo serverInfo;
	serverInfo.id = 5;
	UsedCountablePtr<DataStoreNagios>
	  dataStoreNagiosPtr(new DataStoreNagios(serverInfo, false), false);
	const MonitoringServerInfo &actualServerInfo
	  = dataStoreNagiosPtr->getMonitoringServerInfo();
	cppcut_assert_equal(serverInfo.id, actualServerInfo.id);
}

} // namespace testDataStoreNagios


