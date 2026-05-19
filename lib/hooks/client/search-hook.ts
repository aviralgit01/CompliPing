'use client';

import React, { useState } from 'react';

const useSearch = (
  searchValue: string = '',
  onChangeSearch?: React.Dispatch<React.SetStateAction<string>>
) => {
  if (onChangeSearch) {
    return [searchValue, onChangeSearch] as const;
  } else {
    const [search, setSearch] = useState(searchValue);
    return [search, setSearch] as const;
  }
};

export default useSearch;
