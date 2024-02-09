import {
    Flex, Box, Table, Spinner, Tbody, Td, Text, Select, Th, Thead, Tr,
    useColorModeValue, IconButton, Spacer,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
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
import { ReferenceAttributes, referenceStore } from 'states/reference';
import { MdUpdate } from 'react-icons/md';


interface PopUpState {
    isOpen: boolean;
    row: ReferenceAttributes | null;
    extraData: string;
    error: string | null;
    Loading: boolean;
    Type: "EDIT" | "INSERT" | "DELETE" | "UPDATE";
}


const columnHelper = createColumnHelper<ReferenceAttributes>();


// const columns = columnsDataCheck;
export default function ColumnTable(props: { tableData: any, filters?: any }) {

    const { tableData } = props;
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const [PopUp, setPop] = useState<PopUpState>({
        isOpen: false,
        row: {
            site: "",
            dns: "",
            basic_price: 0.0,
            premuim_price: 0.0,
            gold_price: 0.0,
            elit_price: 0.0
        } as ReferenceAttributes,
        Type: "INSERT",
        Loading: false,
        error: null,
        extraData: ""
    });

    const { references, editReference, deleteReference, addReference } = referenceStore((state) => ({
        references: state.references,
        editReference: state.editReference,
        deleteReference: state.deleteReference,
        addReference: state.addReference,
    }));

    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    let defaultData = tableData;

    const [data, setData] = React.useState(() => [...defaultData]);

    React.useEffect(() => {
        setData(references);
        console.log("references", references);
    }, [references])

    const handlePopUp = (row: ReferenceAttributes, Type: any = "EDIT") => {
        console.log("row", row);
        setPop({ ...PopUp, isOpen: true, row: row, Type: Type });
    }

    const handleCancel = () => {
        setPop({ ...PopUp, isOpen: false, error: null });
    }

    const handleSave = async () => {
        try {
            setPop({ ...PopUp, error: null, Loading: true });
            if (PopUp.Type === "INSERT")
                await addReference(PopUp.row);
            else if (PopUp.Type === "EDIT")
                await editReference(PopUp.row);
            setPop({ ...PopUp, isOpen: false, error: null, Loading: false });
        } catch (e: any) {
            const { data } = e.response;
            console.log(data);
            setPop({ ...PopUp, error: data.message, Loading: false });
            return;
        }
    }

    const handleDelete = async () => {

        try {
            setPop({ ...PopUp, error: null, Loading: true });
            await deleteReference(PopUp.row.id as number);
            setPop({ ...PopUp, isOpen: false });
        } catch (e: any) {
            setPop({ ...PopUp, error: e.message, Loading: false });
            return;
        }

    }

    const columns = [
        columnHelper.accessor('site', {
            id: 'site',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    SITE
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
        columnHelper.accessor('dns', {
            id: 'dns',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    IP-TV DNS
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
        columnHelper.accessor('basic_price', {
            id: 'basic_price',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    Basic Price
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {info.getValue() != undefined ? info.getValue().toString() : "false"}
                </Text>
            )
        }),
        columnHelper.accessor('premuim_price', {
            id: 'premuim_price',
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
                    {info.getValue()}
                </Text>
            )
        }),
        columnHelper.accessor('gold_price', {
            id: 'gold_price',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    Gold Price
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {info.getValue()}
                </Text>
            )
        }),
        columnHelper.accessor('elit_price', {
            id: 'elit_price',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    Elit Price
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {info.getValue() || 0.00}
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
                    References Table
                </Text>
                <Flex align="center" gap={5}>
                    <IconButton
                        aria-label="Edit"
                        icon={<AddIcon />}
                        colorScheme="blue"
                        backgroundColor="blue.500"
                        color={"white"}
                        // variant="ghost"
                        size="sm"
                        _hover={{ backgroundColor: "gray.900" }} // change this to your preferred color
                        onClick={(e) => {
                            handlePopUp({
                                site: "",
                                dns: "",
                                basic_price: 15.0,
                                premuim_price: 15.0,
                                gold_price: 15.0,
                                elit_price: 15.0,
                                created_at: new Date()
                            } as ReferenceAttributes, "INSERT")
                        }}
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



            {PopUp.isOpen && (PopUp.Type === "INSERT" || PopUp.Type === "EDIT") && (
                <AlertDialog isOpen={PopUp.isOpen} leastDestructiveRef={cancelRef} onClose={handleCancel}>
                    <AlertDialogOverlay>
                        <AlertDialogContent>

                            {!PopUp.Loading ?
                                <>
                                    <AlertDialogHeader>
                                        {
                                            PopUp.error == null
                                                ? PopUp.Type == "EDIT" ? "Edit Row" : "Add Row"
                                                : <Text color={"red"}>{PopUp.error}</Text>}
                                    </AlertDialogHeader>
                                    <AlertDialogBody>
                                        <FormControl>
                                            <FormLabel>Site URL</FormLabel>
                                            <Input type="text" value={PopUp.row.site} onChange={(e) => {
                                                setPop(prevState => ({
                                                    ...prevState,
                                                    row: {
                                                        ...prevState.row,
                                                        site: e.target.value as string

                                                    }
                                                }))
                                            }} />

                                            <FormLabel>DNS</FormLabel>
                                            <Input type="text" value={PopUp.row.dns} onChange={(e) => {
                                                setPop(prevState => ({
                                                    ...prevState,
                                                    row: {
                                                        ...prevState.row,
                                                        dns: e.target.value as string

                                                    }
                                                }))
                                            }} />
                                            <FormLabel>Basic Price</FormLabel>
                                            <NumberInput step={1} defaultValue={PopUp.row.basic_price || 15} min={0} max={9999}
                                                onChange={(e) => {
                                                    setPop(prevState => ({
                                                        ...prevState,
                                                        row: {
                                                            ...prevState.row,
                                                            basic_price: parseFloat(e)

                                                        }
                                                    }))

                                                }}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>

                                            <FormLabel>Gold Price</FormLabel>
                                            <NumberInput step={1} defaultValue={PopUp.row.gold_price || 15} min={0} max={9999}
                                                onChange={(e) => {
                                                    setPop(prevState => ({
                                                        ...prevState,
                                                        row: {
                                                            ...prevState.row,
                                                            gold_price: parseFloat(e)

                                                        }
                                                    }))

                                                }}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>

                                            <FormLabel>Premuim Price</FormLabel>

                                            <NumberInput step={1} defaultValue={PopUp.row.premuim_price || 15} min={0} max={9999}
                                                onChange={(e) => {
                                                    setPop(prevState => ({
                                                        ...prevState,
                                                        row: {
                                                            ...prevState.row,
                                                            premuim_price: parseFloat(e)

                                                        }
                                                    }))

                                                }}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>

                                            <FormLabel>Elit Price</FormLabel>

                                            <NumberInput step={1} defaultValue={PopUp.row.elit_price || 15} min={0} max={9999}
                                                onChange={(e) => {
                                                    setPop(prevState => ({
                                                        ...prevState,
                                                        row: {
                                                            ...prevState.row,
                                                            elit_price: parseFloat(e)

                                                        }
                                                    }))

                                                }}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>


                                        </FormControl>

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

            {PopUp.isOpen && PopUp.Type === "DELETE" && (
                <AlertDialog isOpen={PopUp.isOpen} leastDestructiveRef={cancelRef} onClose={handleCancel}>
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            {!PopUp.Loading ?
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

