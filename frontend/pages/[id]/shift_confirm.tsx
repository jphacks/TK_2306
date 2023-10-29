import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Banner from "../../components/Banner";
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import Theme from '../../components/Theme';

type ShiftCandidate = {
    date: string;
    time_from: string;
    time_to: string;
    username: string;
};



const ShiftConfirmPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const [dates, setDates] = useState<string[]>([])

    // useEffect(() => {
    //     fetch(`http://localhost:9000/shift/${id}`)
    //         .then(async (response) => {
    //             if (!response.ok) {
    //                 console.error("Error fetching attributes");
    //             }
    //             return await response.json();
    //         })
    //         .then(async (response) => {
    //             const shifts: ShiftCandidate[] = response["shifts"];
    //             const dates_set = new Set(shifts.map((shift: ShiftCandidate) => shift.date));
    //             const users : string[] = shifts.map((shift: ShiftCandidate) => shift.username);
    //             const dates_array = Array.from(dates_set);
    //             var candidates: string[][] = dates_array.map(() => []);
    //             for (var shift of shifts) {
    //                 const index = dates_array.indexOf(shift.date);
    //                 candidates[index].push(shift.time_from, shift.time_to);
    //             }
    //             setDates(dates_array);

    //         });


    // }, [id]);



    return (
        <Container disableGutters maxWidth={false}>
            <Banner />
            <Theme>
                <Container maxWidth={false} sx={{ paddingTop: 2, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 }}>
                    <h1>Shift Confirmation</h1>
                </Container>
            </Theme>
        </Container>
    );
};

export default ShiftConfirmPage;
