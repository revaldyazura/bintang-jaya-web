import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const List = ({ product, warna, nomor, berat, jenis, kones, stok, write }) => {
  const { produkId } = useParams();
  //  console.log(produkId)
  const [rows, setRows] = useState([]);
  const hexValue = write.slice(0,2)
  const intValue = write.slice(2, 8)
  

  useEffect(() => {
    if (produkId) {
      const productsId = produkId.slice(0, 8);
      const colorId = produkId.slice(8, 11);
        const typeId = produkId.slice(11, 12);
        const conesId = produkId.slice(12, 13);
        const sizeId = produkId.slice(13, 15);
        const amountId = produkId.slice(15, 16);

      const row = {
        productsId,
        colorId,
        typeId,
        conesId,
        sizeId,
        amountId,
      };

      setRows([row]);
    } else {
      const row = {
        productsId: "1100EE00",
        colorId: "01",
        typeId: "1",
        conesId: "1",
        sizeId: "01",
        amountId: "01",
      };
      setRows([row]);
    }
  }, [produkId]);
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          {/* {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="tableCell" align="center">
                {row.productsId} (Barang)
              </TableCell>
              <TableCell className="tableCell"align="center">{row.colorId} (Warna)</TableCell>
              <TableCell className="tableCell"align="center">{row.typeId} (Jenis)</TableCell>
              <TableCell className="tableCell"align="center">{row.conesId} (Kones)</TableCell>
              <TableCell className="tableCell"align="center">{row.sizeId} (Berat)</TableCell>
              <TableCell className="tableCell" align="center">{row.amountId} (Stok)</TableCell>
            </TableRow>
          ))} */}
          <TableCell className="tableCell"align="center">Prefix (Hex)</TableCell>
          <TableCell className="tableCell"align="center">Next (int)</TableCell>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className="tableCell" align="center">{hexValue}</TableCell>
            <TableCell className="tableCell" align="center">{intValue}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
