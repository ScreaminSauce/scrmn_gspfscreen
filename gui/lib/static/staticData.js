// NOTE - This file exists to be the 'database' store for GSPF Pi's - due to limited 
// wifi capability I am gonna hardcode all the data used for the display screens.

module.exports = {
    screenConfig: {
        "name": "default",
        "displayOrder": [{
                "displayName": "Upcoming Events",
                "componentName": "upcomingevents-main",
                "durationInSeconds": "30"
            },
            {
                "displayName": "Sponsors",
                "componentName": "sponsors-main",
                "durationInSeconds": "10"
            },
            {
                "displayName": "Informational Screens",
                "componentName": "infoitems-main",
                "durationInSeconds": "30"
            }
        ]
    },
    infoItems: [
        {
            "title": "Bagatelle is the ancestor of pinball",
            "message": "This “ancestor” of the pinball machine was nothing more than a board with wooden pins and a ball.\n\nIt was such a great success French soldiers brought Bagatalle to America during the American Revolution in the late 18th century.",
            "imageUrl": ""
        },
        {
            "title": "Pinball was officially invented in 1871",
            "message": "It was the inventor Montague Redgrave from Ohio who turned the century old Bagatelle game into the first pinball game. \n\nHe was granted a US patent for his “Improvements in Bagatelle”, which included a coiled spring, a slope and (smaller) marbles. \n\nThe “Parlor Table Bagatelle” game got popular in bars, where high scores would earn you pride and maybe a free drink.",
            "imageUrl": ""
        },
        {
            "title": "“The coin” helped pinball become successful",
            "message": "The pinball machine became real popular during the Depression in the 1930s, due to the need for low cost entertainment. \n\nThe first automatic pinball machine comes from 1931 and it was then coin operated games found their way around the US",
            "imageUrl": ""
        },
        {
            "title": "Pinball was banned for almost 40 years",
            "message": "In the late 1930s, when the first pinball machines were featured with luminescent fields that kept score, the US government started seeing pinball as gambling.\n\nIt got even worse when Bally started making machines that actually cashed out when winning. \n\nThese adjustments were in conflict with the strict gamble laws of the US so pinball machines were banned from the early 1940s until 1976.",
            "imageUrl": ""
        },
        {
            "title": "Video games overruled pinball",
            "message": "With the introduction of the microprocessor, electronic gaming was in and pinball was out. \n\nAlthough the video game boom of the 1980s made pinball machines bite the dust, the pinball industry fought back. \n\nCreative features and designs made the pinball machine stand out a little more, and many of these features are still present today.",
            "imageUrl": ""
        }
    ],
    events: [
        {
            "name": "GSPF Opening",
            "startTime": "2022-05-13T21:00:00.000Z",
            "location": "Main Hall",
            "description": "GSPF 2022 starts today!",
            "presenter": "",
            "imageUrl": ""
        },
        {
            "name": "Kickoff Dinner Party",
            "startTime": "2022-05-13T23:00:00.000Z",
            "location": "Side Hall",
            "description": "Keep an eye here for more information to come about our annual Flippin’ Friday Kick-Off Party!",
            "presenter": "",
            "imageUrl": ""
        },
        {
            "name": "Swap Meet",
            "startTime": "2022-05-14T17:00:00.000Z",
            "location": "Covered Shady Area",
            "description": "Swap Meet for selling and buying pinball parts and accessories! \n\n- Sellers need to bring their own tables \n- No charge to sell once show admission has been paid\n- Items must be related to pinball or “game room stuff;” space is first come, first serve",
            "presenter": "",
            "imageUrl": ""
        },
        {
            "name": "Silent Auction",
            "startTime": "2022-05-15T00:00:00.000Z",
            "location": "Main Hall",
            "description": "There is always an array of exciting items to bid on. In the past there have been some surprising one-of-a-kind biddable bargains show up for the Golden State Silent Auction. \n\nAuction ends promptly at 5:00pm.",
            "presenter": "",
            "imageUrl": ""
        },
        {
            "name": "Pinball Raffle",
            "startTime": "2022-05-15T00:30:00.000Z",
            "location": "Main Hall",
            "description": "We will be having a raffle drawing for a pinball machine! \n\nFor $5 you get one chance to win your very own pinball machine! \n\nMUST be present to win! Games must be picked up by noon Monday at the show site.",
            "presenter": "",
            "imageUrl": ""
        },
        {
            "name": "Pinball Raffle",
            "startTime": "2022-05-15T23:30:00.000Z",
            "location": "Main Hall",
            "description": "We will be having a raffle drawing for a pinball machine! \n\nFor $5 you get one chance to win your very own pinball machine! \n\nMUST be present to win! Games must be picked up by noon Monday at the show site.",
            "presenter": "",
            "imageUrl": ""
        }
    ],
}