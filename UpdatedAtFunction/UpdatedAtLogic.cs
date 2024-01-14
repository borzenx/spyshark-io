using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace UpdatedAtFunction
{
    public class UpdatedAtLogic
    {
        [FunctionName("UpdatedAtLogic")]
        public async Task Run([TimerTrigger("0 */1 * * * *")] TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
            string clientId = "c4820a16-4060-4b19-a95e-55730da12d74";
            string clientSecret = "Y4G8Q~zmFm59jv~kKj3LK.Sv4inSN7l9YLNc7bdb";
            string apiScope = "https://spyshark.onmicrosoft.com/c4820a16-4060-4b19-a95e-55730da12d74/.default";

            string tokenEndpoint = "https://spyshark.b2clogin.com/spyshark.onmicrosoft.com/b2c_1_signupsignin/oauth2/v2.0/token";
            var tokenRequestContent = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret),
                new KeyValuePair<string, string>("scope", apiScope),
            });

            using (HttpClient httpClient = new HttpClient())
            {
                var tokenResponse = await httpClient.PostAsync(tokenEndpoint, tokenRequestContent);
                var tokenResponseBody = await tokenResponse.Content.ReadAsStringAsync();
                var token = JsonConvert.DeserializeObject<JObject>(tokenResponseBody)["access_token"].ToString();
                if (token != null)
                {
                    log.LogInformation("Token obtained successfully");
                }

                string apiEndpoint = "https://shopifystatsapi.azurewebsites.net/UpdatedAtDatabaseLogic"; 

                using (HttpClient apiClient = new HttpClient())
                {
                    apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                    var apiResponse = await apiClient.PostAsync(apiEndpoint, null);

                    log.LogInformation($"API Response: {apiResponse.StatusCode}");
                }
            }
        }
    }
}
