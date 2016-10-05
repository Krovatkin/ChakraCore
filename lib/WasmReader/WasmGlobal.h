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

        enum PointerType { Invalid, Const, LocalReference, ImportedReference };

        WasmGlobal(uint32 _type, bool mutability);
        uint32 getType() const;
        bool getMutability() const;
        PointerType ptype;

        union
        {
            WasmConstLitNode cnst;
            WasmVarNode var;
            GlobalImport* importVar;
        };

    private:

        uint32 type;
        bool mutability;

        
    };
} // namespace Wasm