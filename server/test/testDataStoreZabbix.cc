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
#include "DataStoreZabbix.h"
#include "Hatohol.h"
#include "ArmZabbixAPI.h"
#include "DBTablesTest.h"

using namespace mlpl;

namespace testDataStoreZabbix {

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
	MonitoringServerInfo::initialize(serverInfo);
	serverInfo.id = 5;
	UsedCountablePtr<DataStoreZabbix>
	  dataStoreZabbixPtr(new DataStoreZabbix(serverInfo, false), false);
	const MonitoringServerInfo &actualServerInfo
	  = dataStoreZabbixPtr->getMonitoringServerInfo();
	cppcut_assert_equal(serverInfo.id, actualServerInfo.id);
}

} // namespace testDataStoreZabbix

