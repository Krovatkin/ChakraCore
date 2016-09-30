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
        WasmGlobal(ArenaAllocator * alloc, uint32 _type, bool mutability);
        uint32 getType() const;
        bool getMutability() const;
        WasmNode* getInit() const;
        bool import; //TODO maybe merge these two via enum?
        bool ref;

        union
        {
            WasmConstLitNode cnst;
            //Js::WasmGlobal::WasmConst cnst;
            WasmVarNode var;
            WasmNode* init;
            GlobalImport* importVar;
        };

    private:
        //ArenaAllocator * m_alloc;

        uint32 type;
        bool mutability;

        
    };
} // namespace Wasm