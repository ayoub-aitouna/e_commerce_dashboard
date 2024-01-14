import {
    Flex, Box, Table, Spinner, Tbody, Td, Text, Select, Th, Thead, Tr,
    useColorModeValue, IconButton, Spacer
} from '@chakra-ui/react';

import * as React from 'react';
import { useState, useRef } from 'react';

import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from '@tanstack/react-table';

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react';

// Custom components
import Card from 'components/card/Card';
import { ProductAttributes, IpTvType, Filters, productStore } from 'states/products';



interface PopUpState {
    isOpen: boolean;
    row: ProductAttributes | null;
    Type: "EDIT" | "INSERT" | "DELETE";
}


const columnHelper = createColumnHelper<ProductAttributes>();

const ParseDate = (date: Date | null): string => {
    if (date == null) return "--/--/--";
    if (typeof date === "string") date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[month];

    const formattedDate = `${day}/${monthName}/${year}`;
    return formattedDate;
}


// const columns = columnsDataCheck;
export default function ColumnTable(props: { tableData: any, filters?: any }) {
    const { tableData } = props;
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [PopUp, setPop] = useState<PopUpState>({
        isOpen: false,
        row: { type: IpTvType.Basic, sold: false, } as ProductAttributes,
        Type: "INSERT",
    });

    const { products, editProduct, deleteProduct, addProduct, error, Loading } = productStore((state) => ({
        products: state.products,
        editProduct: state.editProduct,
        deleteProduct: state.deleteProduct,
        addProduct: state.addProduct,
        error: state.error,
        Loading: state.Loading,
    }));

    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    let defaultData = tableData;

    const [data, setData] = React.useState(() => [...defaultData]);

    React.useEffect(() => {
        console.log(data);
        let defaultData = products;
        setData([...defaultData])
    }, [products])


    const handlePopUp = (row: ProductAttributes, Type: any = "EDIT") => {
        setPop({ ...PopUp, isOpen: true, row: row, Type: Type });
    }

    const handleCancel = () => {
        setPop({ ...PopUp, isOpen: false });
    }

    const handleSave = async () => {
        // api call
        console.log(PopUp.row);
        if (PopUp.Type == "INSERT")
            await addProduct(PopUp.row);
        else if (PopUp.Type == "EDIT")
            await editProduct(PopUp.row);
        setPop({ ...PopUp, isOpen: false });
    }

    const handleDelete = async () => {
        // api call
        await deleteProduct(PopUp.row.id as number);
        setPop({ ...PopUp, isOpen: false });
    }

    const columns = [
        columnHelper.accessor('iptv_url', {
            id: 'iptv_url',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    IPTV URL
                </Text>
            ),
            cell: (info: any) => (
                <Flex align='center' maxWidth={'200px'}>
                    <Text
                        color={textColor}
                        fontSize='sm'
                        fontWeight='700'
                        isTruncated
                        maxWidth="60ch"
                        title={info.getValue()} // Show full text on hover
                    >
                        {info.getValue()}
                    </Text>
                </Flex>
            )
        }),
        columnHelper.accessor('type', {
            id: 'type',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    TYPE
                </Text>
            ),
            cell: (info: any) => (
                <Flex align='center'>
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {info.getValue()}
                    </Text>
                </Flex>
            )
        }),
        columnHelper.accessor('sold', {
            id: 'sold',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    SOLD
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {info.getValue().toString()}
                </Text>
            )
        }),
        columnHelper.accessor('solded_at', {
            id: 'solded_at',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    Date Of Sell
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {ParseDate(info.getValue())}
                </Text>
            )
        }),
        columnHelper.accessor('created_at', {
            id: 'created_at',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    DATE OF CREATION
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {ParseDate(info.getValue())}
                </Text>
            )
        }),
        {
            id: 'edit',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    EDIT
                </Text>
            ),
            cell: (info: any) => (
                <Flex align="center">
                    <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handlePopUp(info.row.original)}
                    />
                </Flex>
            )
        },
        {
            id: 'delete',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    DELETE
                </Text>
            ),
            cell: (info: any) => (
                <Flex align="center">
                    <IconButton
                        aria-label="Edit"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => setPop({ ...PopUp, isOpen: true, row: info.row.original, Type: "DELETE" })}
                    />
                </Flex>
            )
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true
    });


    return (
        <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
            <Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
                <Text color={textColor} fontSize='22px' mb="4px" fontWeight='700' lineHeight='100%'>
                    Available IPTV
                </Text>
                <Flex align="center">
                    <IconButton
                        aria-label="Edit"
                        icon={<AddIcon />}
                        colorScheme="blue"
                        backgroundColor="blue.500"
                        color={"white"}
                        // variant="ghost"
                        size="sm"
                        _hover={{ backgroundColor: "gray.900" }} // change this to your preferred color
                        onClick={(e) => { handlePopUp({} as ProductAttributes, "INSERT") }}
                    />
                </Flex>
            </Flex>
            <Box>
                <Table variant='simple' color='gray.500' mb='24px' mt="12px">
                    <Thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            pe='10px'
                                            borderColor={borderColor}
                                            cursor='pointer'
                                            onClick={header.column.getToggleSortingHandler()}>
                                            <Flex
                                                justifyContent='space-between'
                                                align='center'
                                                fontSize={{ sm: '10px', lg: '12px' }}
                                                color='gray.400'>
                                                {flexRender(header.column.columnDef.header, header.getContext())}{{
                                                    asc: '',
                                                    desc: '',
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </Flex>
                                        </Th>
                                    );
                                })}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table.getRowModel().rows.slice(0, 11).map((row) => {
                            return (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td
                                                key={cell.id}
                                                fontSize={{ sm: '14px' }}
                                                minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                                                borderColor='transparent'>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Td>
                                        );
                                    })}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>



            {PopUp.isOpen && PopUp.Type != "DELETE" && (
                <AlertDialog isOpen={PopUp.isOpen} leastDestructiveRef={cancelRef} onClose={handleCancel}>
                    <AlertDialogOverlay>
                        <AlertDialogContent>

                            {!Loading ?
                                <>
                                    <AlertDialogHeader>
                                        {
                                            error == null
                                                ? PopUp.Type == "EDIT" ? "Edit Row" : "Add Row"
                                                : <Text color={"red"}>{error}</Text>}
                                    </AlertDialogHeader>
                                    <AlertDialogBody>
                                        <FormControl>
                                            <FormLabel>URL</FormLabel>
                                            <Input type="text" value={PopUp.row.iptv_url} onChange={(e) => {
                                                setPop(prevState => ({
                                                    ...prevState,
                                                    row: {
                                                        ...prevState.row,
                                                        iptv_url: e.target.value as string

                                                    }
                                                }))
                                            }} />

                                            <FormLabel>Type</FormLabel>
                                            <Select value={PopUp.row.type} onChange={(e) => {
                                                setPop(prevState => ({
                                                    ...prevState,
                                                    row: {
                                                        ...prevState.row,
                                                        type: e.target.value as IpTvType
                                                    }
                                                }
                                                ))
                                            }}>
                                                {Object.values(IpTvType).map((enumValue) => (
                                                    <option key={enumValue} value={enumValue}>
                                                        {enumValue}
                                                    </option>
                                                ))}

                                            </Select>
                                        </FormControl>
                                        {/* Add more form fields for other row properties */}
                                    </AlertDialogBody>
                                    <AlertDialogFooter>
                                        <Button colorScheme="blue" onClick={handleSave}>
                                            Save
                                        </Button>
                                        <Button ref={cancelRef} onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </AlertDialogFooter>
                                </>
                                :
                                <Flex direction="column" align="center" justify="center" m={10} >
                                    <Spinner size="lg" />
                                </Flex>}

                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            )
            }

            {PopUp.isOpen && PopUp.Type == "DELETE" && (
                <AlertDialog isOpen={PopUp.isOpen} leastDestructiveRef={cancelRef} onClose={handleCancel}>
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            {!Loading ?
                                <>
                                    <AlertDialogHeader>DELETE</AlertDialogHeader>
                                    <AlertDialogBody>
                                        <Text>Are you sure you want to delete this row?</Text>
                                    </AlertDialogBody>

                                    <AlertDialogFooter>
                                        <Button colorScheme="red" onClick={handleDelete}>
                                            Yes
                                        </Button>
                                        <Spacer />
                                        <Button ref={cancelRef} onClick={handleCancel}>
                                            No
                                        </Button>
                                    </AlertDialogFooter>
                                </>
                                :
                                <Flex direction="column" align="center" justify="center" m={10} >
                                    <Spinner size="lg" />
                                </Flex>}
                        </AlertDialogContent>

                    </AlertDialogOverlay>
                </AlertDialog>
            )}

        </Card >
    );
}

