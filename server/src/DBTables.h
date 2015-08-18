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

#ifndef DBTables_h
#define DBTables_h

#include <string>
#include <memory>
#include <Mutex.h>
#include "Params.h"
#include "DBAgent.h"

class DBTables {
public:
	struct Version {
		static const int VENDOR_BITS;
		static const int MAJOR_BITS;
		static const int MINOR_BITS;

		int vendorVer;
		int majorVer;
		int minorVer;

		static int getPackedVer(const int &vendor,
		                        const int &major, const int &manior);
		Version(void);
		int getPackedVer(void) const;
		void setPackedVer(const int &packedVer);
		std::string toString(void) const;
	};

	// TODO: remove DBClient::DBSetupFuncArg after this class is
	// implemented.
	typedef void (*CreateTableInitializer)(DBAgent &, void *data);
	typedef bool (*DBUpdater)(DBAgent &, const Version &oldVer, void *data);

	struct TableSetupInfo {
		const DBAgent::TableProfile *profile;
		CreateTableInitializer       initializer;
		void                        *initializerData;
	};

	struct SetupInfo {
		DBTablesId              tablesId;
		int                     version;
		size_t                  numTableInfo;
		const TableSetupInfo   *tableInfoArray;
		DBUpdater               updater;
		void                   *updaterData;
		bool                    initialized;
		mlpl::Mutex             lock;
	};

	template <class DBT>
	static void checkMajorVersion(DBAgent &dbAgent)
	{
		checkMajorVersionMain(DBT::getConstSetupInfo(), dbAgent);
	}

	DBTables(DBAgent &dbAgent, SetupInfo &setupInfo);
	virtual ~DBTables(void);

	DBAgent &getDBAgent(void);

protected:
	static void checkMajorVersionMain(
	  const SetupInfo &setupInfo, DBAgent &dbAgent);

	void begin(void);
	void rollback(void);
	void commit(void);

	void insert(const DBAgent::InsertArg &insertArg);
	void update(const DBAgent::UpdateArg &updateArg);
	void select(const DBAgent::SelectArg &selectArg);
	void select(const DBAgent::SelectExArg &selectExArg);
	void deleteRows(const DBAgent::DeleteArg &deleteArg);
	void addColumns(const DBAgent::AddColumnsArg &addColumnsArg);
	bool isRecordExisting(const std::string &tableName,
	                      const std::string &condition);
	uint64_t getLastInsertId(void);
	bool updateIfExistElseInsert(
	  const ItemGroup *itemGroup, const DBAgent::TableProfile &tableProfile,
	  size_t targetIndex);

private:
	struct Impl;
	std::unique_ptr<Impl> m_impl;
};

#endif // DB_h
