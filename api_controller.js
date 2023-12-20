import itemsModel from "./dbSchema.js";
import axios from "axios";

export const populatedbcontroller = async (req, res) => {
    try {
        let api_url = req.body.api_url
        let api_resp = await fetch(api_url,
            {
                method: "GET", headers:
                    { Accept: 'application/json', 'Content-Type': 'application/json', }
            }).then((response) => response.json());

        api_resp.forEach(async (record) => {
            let month = Number(record.dateOfSale.split("-")[1]);
            let id = record.id;
            let title = record.title;
            let price = record.price;
            let description = record.description;
            let category = record.category;
            let image = record.image;
            let sold = record.sold;
            let date = record.dateOfSale;

            let new_record = await new itemsModel({
                id,
                title,
                price,
                description,
                category,
                image,
                sold,
                date,
                month,
            }).save();
        });

        res.status(200).send({
            success: true,
            message: "Database initialized successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in populating database",
            error,
        });
    }
}

export const getItemsController = async (req, res) => {
    try {
        itemsModel.createIndexes({ description: "text", title: "text", price: "text" });
        let { search_query, page_num, month, per_page } = req.params;
        if (page_num == null) {
            page_num = 1;
        }
        if (per_page == null) {
            per_page = 10;
        }
        let items;
        if (search_query == "" || search_query == null || search_query == "null" || search_query == " ") {
            items = await itemsModel.find({ month }).skip((page_num - 1) * per_page).limit(per_page).then((documents) => documents);
        }
        //Title, description, price are text indexed for searching.
        else {
            items = await itemsModel.find({ $text: { $search: search_query, $caseSensitive: false }, month }).skip((page_num - 1) * per_page).limit(per_page).then((documents) => documents);
        }
        res.status(200).send({
            success: true,
            message: "Items fetched successfully",
            items,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting items",
            error,
        });
    }
}

export const statisticsController = async (req, res) => {
    try {
        let { month } = req.params;
        month = Number(month);

        let items = await itemsModel.find({ month });
        let solditems = items.filter((item) => item.sold == true);

        let totalsale = 0;
        let totalitems = items.length;
        let totalsolditems = solditems.length;
        let totalnotsolditems = totalitems - totalsolditems;

        solditems.forEach((item) => {
            totalsale += item.price;
        })

        res.status(200).send({
            success: true,
            message: "Monthly Statistics",
            totalsolditems,
            totalnotsolditems,
            totalsale,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting statistics",
            error,
        });
    }
}

export const barchartcontroller = async (req, res) => {
    try {
        let { month } = req.params;
        month = Number(month);

        let all_items = await itemsModel.find({ month });

        let zeroToHundred = (await itemsModel.find({ price: { $gte: 0, $lte: 100 }, month })).length;
        let HundredToTwoHundred = (await itemsModel.find({ price: { $gte: 101, $lte: 200 }, month })).length;
        let TwoHundredToThreeHundred = (await itemsModel.find({ price: { $gte: 201, $lte: 300 }, month })).length;
        let ThreeHundredToFourHundred = (await itemsModel.find({ price: { $gte: 301, $lte: 400 }, month })).length;
        let FourHundredToFiveHundred = (await itemsModel.find({ price: { $gte: 401, $lte: 500 }, month })).length;
        let FiveHundredToSixHundred = (await itemsModel.find({ price: { $gte: 501, $lte: 600 }, month })).length;
        let SixHundredToSevenHundred = (await itemsModel.find({ price: { $gte: 601, $lte: 700 }, month })).length;
        let SevenHundredToEightHundred = (await itemsModel.find({ price: { $gte: 701, $lte: 800 }, month })).length;
        let EightHundredToNineHundred = (await itemsModel.find({ price: { $gte: 801, $lte: 900 }, month })).length;
        let AboveNineHundred = (await itemsModel.find({ price: { $gte: 901 }, month })).length;

        res.status(200).send({
            success: true,
            message: "Bar chart info fetched",
            zeroToHundred,
            HundredToTwoHundred,
            TwoHundredToThreeHundred,
            ThreeHundredToFourHundred,
            FourHundredToFiveHundred,
            FiveHundredToSixHundred,
            SixHundredToSevenHundred,
            SevenHundredToEightHundred,
            EightHundredToNineHundred,
            AboveNineHundred,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting bar chat info",
            error,
        });
    }
}

export const piechartcontroller = async (req, res) => {
    try {
        let { month } = req.params;
        month = Number(month);
        let items = await itemsModel.aggregate([{ $match: { month } }, { $group: { _id: "$category", count: { $sum: 1 } } }]);
        res.status(200).send({
            success: true,
            message: "Pie chart info",
            items,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting pie chat info",
            error,
        });
    }
}

export const combinedapicontroller = async (req, res) => {
    try {
        let { month } = req.params;
        month = Number(month);

        let items_statistics = await fetch(`http://localhost:8080/api/statistics/${month}`,
            {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            }).then((response) => response.json());
        let items_bar_chart = await fetch(`http://localhost:8080/api/bar-chart-info/${month}`,
            {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            }).then((response) => response.json());
        let items_pie_chart = await fetch(`http://localhost:8080/api/pie-chart-info/${month}`,
            {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            }).then((response) => response.json());


        res.status(200).send({
            success: true,
            message: "Combined api info",
            items_statistics,
            items_bar_chart,
            items_pie_chart,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting combined api info",
            error,
        });
    }
}