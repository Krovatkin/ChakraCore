//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft Corporation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------

#pragma once



namespace Wasm
{

    class WasmGlobal
    {
        

    public:

        enum ReferenceType { Invalid, Const, LocalReference, ImportedReference };

        WasmGlobal(uint32 _type, bool mutability);
        uint32 GetType() const;
        bool GetMutability() const;
        ReferenceType GetReferenceType() { return m_rType; };
        void SetReferenceType(ReferenceType rt) { m_rType = rt; };

        union
        {
            WasmConstLitNode cnst;
            WasmVarNode var;
            GlobalImport* importVar;
        };

    private:

        ReferenceType m_rType;
        uint32 m_type;
        bool m_mutability;

        
    };
} // namespace Wasm