//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft Corporation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------

#include "WasmReaderPch.h"

#ifdef ENABLE_WASM

namespace Wasm
{

WasmGlobal::WasmGlobal(uint32 _type, bool _mutability) : 
    m_type(_type), 
    m_mutability(_mutability), 
    m_rType(Invalid)
{
}

uint32 
WasmGlobal::GetType() const
{
    return m_type;
}

bool
WasmGlobal::GetMutability() const
{
    return m_mutability;
}
} // namespace Wasm
#endif // ENABLE_WASM